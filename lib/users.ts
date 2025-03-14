// In a real application, this would be replaced with a database
// This is a simple in-memory user store for demonstration purposes

import { hash, compare } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In real app, only store hashed passwords
  role?: "user" | "admin";
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, "password">;

// Initialize with a demo user
let users: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    // "password" hashed with bcrypt
    password: "$2a$10$8KVxuHf1LJC6LtI3.lWT2uKAKfHXKEVH.ZwB4KHgj0FhHDZ9nIRDi",
    role: "user",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    // "adminpassword" hashed with bcrypt
    password: "$2a$10$3JE7FinlS3C0LRGCVKDSs.9MQhOZXNYxIbQw6A8.qdfjwx2VWDHVi",
    role: "admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  }
];

// Safe user converter - Remove sensitive information
export function toSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

// Get all users (for auth) - without passwords
export function getUsers(): User[] {
  return users;
}

// Get all users as safe users (no passwords)
export function getSafeUsers(): SafeUser[] {
  return users.map(toSafeUser);
}

// Add a new user (for registration)
export async function addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<SafeUser> {
  // Check if email already exists
  if (getUserByEmail(userData.email)) {
    throw new Error("Email already in use");
  }

  // Create new user object with ID and timestamps
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    role: userData.role || "user", // Default role is user
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  users.push(newUser);
  return toSafeUser(newUser);
}

// Create a user with password hashing
export async function createUser(
  name: string, 
  email: string, 
  password: string,
  role?: "user" | "admin"
): Promise<SafeUser> {
  // Hash password
  const hashedPassword = await hash(password, 10);
  
  return addUser({
    name,
    email,
    password: hashedPassword,
    role,
  });
}

// Get user by ID
export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

// Get user by ID (safe version)
export function getSafeUserById(id: string): SafeUser | undefined {
  const user = getUserById(id);
  return user ? toSafeUser(user) : undefined;
}

// Get user by email
export function getUserByEmail(email: string): User | undefined {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Get user by email (safe version)
export function getSafeUserByEmail(email: string): SafeUser | undefined {
  const user = getUserByEmail(email);
  return user ? toSafeUser(user) : undefined;
}

// Update user
export function updateUser(id: string, userData: Partial<Omit<User, "id" | "password" | "createdAt" | "updatedAt">>): SafeUser | null {
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // If updating email, check if it's already taken by another user
  if (userData.email) {
    const existingUserWithEmail = getUserByEmail(userData.email);
    if (existingUserWithEmail && existingUserWithEmail.id !== id) {
      throw new Error("Email already in use");
    }
  }
  
  // Update the user
  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date()
  };
  
  return toSafeUser(users[index]);
}

// Update user password
export async function updateUserPassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return false;
  }
  
  // Verify current password
  const isCurrentPasswordValid = await compare(currentPassword, users[index].password);
  
  if (!isCurrentPasswordValid) {
    return false;
  }
  
  // Hash and update the password
  const hashedPassword = await hash(newPassword, 10);
  users[index] = {
    ...users[index],
    password: hashedPassword,
    updatedAt: new Date()
  };
  
  return true;
}

// Delete user
export function deleteUser(id: string): boolean {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length < initialLength;
}

// Authenticate user (for testing login directly)
export async function authenticateUser(email: string, password: string): Promise<SafeUser | null> {
  const user = getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  return toSafeUser(user);
}

// For demonstration/debugging
export function getUserCount(): number {
  return users.length;
}

// Initialize some more users for testing (in development)
if (process.env.NODE_ENV === "development") {
  // This would only run in development mode
  const ensureTestUsers = async () => {
    try {
      if (!getUserByEmail("test@example.com")) {
        await createUser("Test User", "test@example.com", "testpassword");
      }
    } catch (error) {
      // Silently fail on duplicate attempts
    }
  };
  
  ensureTestUsers();
}

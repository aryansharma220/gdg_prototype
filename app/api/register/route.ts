import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/users';
import { validateEmail, validatePassword, validateName } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate name
    if (!validateName(name)) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await createUser(name, email, password);

    // Return success without sensitive information
    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message === "Email already in use" ? 409 : 500 }
    );
  }
}

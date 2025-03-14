export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  
  // Optional: Add more password validation rules
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasNonalphas = /\W/.test(password);
  // if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasNonalphas) {
  //   return "Password must contain uppercase, lowercase, number and special character";
  // }
  
  return null;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export type AuthError = {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
};

export const validateSignupForm = (
  name: string, 
  email: string, 
  password: string, 
  agreeTos: boolean
): AuthError | null => {
  const errors: AuthError = {};
  
  if (!name || !validateName(name)) {
    errors.name = "Please enter a valid name";
  }
  
  if (!email || !validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  if (!agreeTos) {
    errors.general = "You must agree to the Terms of Service";
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateLoginForm = (
  email: string, 
  password: string
): AuthError | null => {
  const errors: AuthError = {};
  
  if (!email || !validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }
  
  if (!password) {
    errors.password = "Password is required";
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

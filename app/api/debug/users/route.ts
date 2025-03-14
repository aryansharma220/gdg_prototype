import { NextResponse } from 'next/server';
import { getSafeUsers } from '@/lib/users';

// Debug endpoint to check registered users - ONLY FOR DEVELOPMENT
export async function GET() {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  
  const users = getSafeUsers();
  return NextResponse.json(users);
}

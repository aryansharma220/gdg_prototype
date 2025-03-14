import { NextRequest, NextResponse } from 'next/server';
import { getSafeUsers } from '@/lib/users';
import { getServerSession } from 'next-auth';

// GET handler to list all users (admin only)
export async function GET(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // In a real app, check for admin role in the database
    // For this demo, we're checking a simplified approach
    const userRole = session.user.email === "admin@example.com" ? "admin" : "user";
    
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const users = getSafeUsers();
    return NextResponse.json(users);
    
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

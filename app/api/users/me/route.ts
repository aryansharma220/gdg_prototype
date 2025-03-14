import { NextRequest, NextResponse } from 'next/server';
import { getSafeUserById, updateUser } from '@/lib/users';
import { getServerSession } from 'next-auth';

// GET current user profile
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = getSafeUserById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update current user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Prevent role updates through this endpoint
    if (data.role) {
      delete data.role;
    }
    
    const updatedUser = updateUser(session.user.id, data);
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
    
  } catch (error: any) {
    console.error("Error updating profile:", error);
    
    if (error.message === "Email already in use") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

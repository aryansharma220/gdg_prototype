import { NextRequest, NextResponse } from 'next/server';
import { getSafeUserById, updateUser, deleteUser } from '@/lib/users';
import { getServerSession } from 'next-auth';

// GET handler to get a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await getServerSession();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Users can only access their own profile, admins can access any
    // In a real app, you'd check roles from your database
    const isAdmin = session.user.email === "admin@example.com";
    const isOwnProfile = session.user.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const user = getSafeUserById(id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await getServerSession();
    const data = await req.json();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Users can only update their own profile, admins can update any
    const isAdmin = session.user.email === "admin@example.com";
    const isOwnProfile = session.user.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Disallow role updates except by admins
    if (data.role && !isAdmin) {
      delete data.role;
    }
    
    const updatedUser = updateUser(id, data);
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
    
  } catch (error: any) {
    console.error("Error in user update API:", error);
    
    if (error.message === "Email already in use") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await getServerSession();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only admins can delete users or users can delete themselves
    const isAdmin = session.user.email === "admin@example.com";
    const isOwnProfile = session.user.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const result = deleteUser(id);
    
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error in user delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the pathname starts with /dashboard or other protected routes
  const isProtected = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/profile') ||
    pathname.startsWith('/courses/my')
  
  // Auth routes that should redirect to dashboard if already logged in
  const isAuthRoute = 
    pathname === '/login' ||
    pathname === '/signup' || 
    pathname === '/forgot-password'
  
  // Get the user token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // If it's a protected route and no token, redirect to login
  if (isProtected && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(url)
  }
  
  // If accessing auth routes while logged in, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}

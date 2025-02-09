import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // If the user is on "/" (home page) and is authenticated, redirect to /dashboard
  if (req.nextUrl.pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect to /dashboard if logged in
    }
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not logged in
  }

  // If the user is on /login or /register and they have a valid token, redirect to /dashboard
  if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect to /dashboard if logged in
    }
    return NextResponse.next(); // If no token, allow access to /login or /register
  }

  // Protect /dashboard, /subject, /assignment
  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/subject") ||
    req.nextUrl.pathname.startsWith("/assignment")||
    req.nextUrl.pathname.startsWith("/test")
  ) {
    // If token is missing, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Verify the JWT
      await jwtVerify(token, secret);
      return NextResponse.next(); // Allow access to the protected page
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token"); // Delete the invalid token
      return response;
    }
  }

  return NextResponse.next(); // Allow other non-protected routes
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/subject/:path*", "/assignment/:path*" , "/test"], // Protect /dashboard, /subject, /assignment, and manage /login /register
};

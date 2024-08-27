import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/profil", "/settings"];

export function middleware(request: NextRequest) {
  console.log("Middleware triggered on:", request.nextUrl.pathname);

  const token = request.cookies.get("token")?.value;
  console.log("Token:", token);

  // Check if the request is for a protected route
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      // If no token, redirect to login page
      const loginUrl = new URL("/logga-in", request.url);
      console.log("Redirecting to:", loginUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow request to proceed if authenticated or not a protected route
  return NextResponse.next();
}

// Define the paths where the middleware should run
export const config = {
  matcher: ["/dashboard/:path*", "/profil/:path*", "/settings/:path*"], // Add more routes as needed
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // The admin layout handles auth checking server-side via Better Auth
  // This middleware just ensures API routes are properly handled
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

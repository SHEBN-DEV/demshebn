import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.pathname;

  if (url.startsWith("/api/didit-callback")) {
    const res = NextResponse.next();

    res.headers.set("X-Frame-Options", "ALLOWALL");
    res.headers.set("Content-Security-Policy", "frame-ancestors *");

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/didit-callback/:path*"]
};

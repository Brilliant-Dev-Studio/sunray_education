import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/app/lib/session";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isLoginRoute = path === "/admin/login";
  const isAdminRoute = path.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(cookie);

  if (!isLoginRoute && !session?.adminId) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginRoute && session?.adminId) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

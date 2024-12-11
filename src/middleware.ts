// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { keyStorage } from "./constants/storage/key_storage";
import { routed } from "./constants/navigation/routed";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(keyStorage.TOKEN);

  // Check if the request is for a public path
  // if (!token) {
  //   return NextResponse.redirect(new URL(`/${routed.login}`, request.url));
  // }

  // If the token exists, allow access to the requested page
  return NextResponse.next();
}

// Define pages where the middleware applies
export const config = {
  matcher: `/${routed.userManagement}/:path*`,
};

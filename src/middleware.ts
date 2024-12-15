// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { keyStorage } from "./constants/storage/key_storage";
import { routed } from "./constants/navigation/routed";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(keyStorage.TOKEN);

  if (!token) {
    return NextResponse.redirect(new URL("/" + routed.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};

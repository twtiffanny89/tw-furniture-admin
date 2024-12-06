// middleware.ts

import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next(); // Continue to the requested page
}

import { NextResponse } from "next/server";
import validateServerSession from "@/lib/server/validateServerSession";

export async function GET(request) {
  const user = await validateServerSession();

  return NextResponse.json({
    ...user,
    isLoggedIn: user ? true : false
  });
}
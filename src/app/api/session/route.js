import { NextResponse } from "next/server";
import validateServerSession from "@/lib/server/validateServerSession";

export async function GET(request) {
  const user = await validateServerSession();
  const { sessionId, ...userWithoutSessionId } = user;

  return NextResponse.json({
    ...userWithoutSessionId,
    isLoggedIn: user ? true : false
  });
}
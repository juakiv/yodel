import { NextResponse } from "next/server";

import prisma from "@/lib/server/prisma";
import validateServerSession from "@/lib/server/validateServerSession";

export async function POST(request) {
  const user = await validateServerSession();

  if(!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const logoutSession = await prisma.session.update({
    where: {
      id: user.sessionId
    },
    data: {
      expiresAt: new Date().toISOString()
    }
  });

  if(!logoutSession) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const logoutResponse = NextResponse.json({ success: true });
  logoutResponse.cookies.delete("sessionToken");
  return logoutResponse;
}
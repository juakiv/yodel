import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request) {
  const user = await validateServerSession();
  const { sessionId, token, ...userWithoutSessionId } = user;

  if(user) {
    await prisma.session.update({
      where: {
        id: sessionId
      }, 
      data: {
        lastSeen: new Date()
      }
    });
  }

  return NextResponse.json({
    ...userWithoutSessionId,
    isLoggedIn: user ? true : false
  });
}
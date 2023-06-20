import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value ?? null;

  if(!sessionToken) {
    const response = NextResponse.json({
      user: null
    });

    return response;
  }
  
  const user = await prisma.session.findFirst({
    where: {
      token: sessionToken,
      expiresAt: {
        gte: new Date()
      }
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          points: true
        }
      }
    }
  });

  if(!user) {
    const response = NextResponse.json({
      user: null
    });

    response.cookies.delete("sessionToken");

    return response;
  }

  return NextResponse.json({
    user: user.user
  });
}
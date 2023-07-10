import { NextResponse } from "next/server";

import prisma from "@/lib/server/prisma";
import validateServerSession from "@/lib/server/validateServerSession";

export async function GET(request) {
  const user = await validateServerSession();

  if(!user) {
    return NextResponse.json({ success: false, message: "Et ole kirjautunut."}, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: user.id,
      expiresAt: {
        gte: new Date().toISOString()
      }
    },
    orderBy: [
      {
        lastSeen: "desc"
      }
    ],
    select: {
      id: true,
      lastSeen: true,
      token: true
    }
  });

  const sessionsFormatted = sessions.map(session => {
    const { token, ...sessionWithoutToken } = session;
    return {
      ...sessionWithoutToken,
      current: user.token === token
    }
  });

  return NextResponse.json(sessionsFormatted);
}

export async function POST(request) {
  const user = await validateServerSession();
  if(!user) {
    return NextResponse.json({ success: false, message: "Et ole kirjautunut."}, { status: 401 });
  }
  
  const data = await request.json();
  const isCurrentUserSession = await prisma.session.count({
    where: {
      userId: user.id,
      id: data.id,
      expiresAt: {
        gte: new Date().toISOString()
      }
    }
  }) > 0;
  
  if(!isCurrentUserSession) {
    return NextResponse.json({ success: false, message: "Ei oikeuksia tai sessiota ei ole olemassa."}, { status: 422 });
  }

  const loggedOutId = await prisma.session.update({
    where: {
      id: data.id
    },
    data: {
      expiresAt: new Date().toISOString()
    },
    select: {
      id: true
    }
  });

  return NextResponse.json({ success: true, session: loggedOutId.id });
}
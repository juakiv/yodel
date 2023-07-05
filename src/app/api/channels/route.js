import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request) {
  const channels = await prisma.channel.findMany({
    where: {
      deletedAt: null
    },
    select: {
      name: true,
      _count: {
        select: {
          posts: true
        }
      }
    }
  });

  return NextResponse.json(channels);
}

const kebabCase = string => string
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

export async function POST(request) {
  const user = await validateServerSession();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const data = await request.json();
  if (!"name" in data) {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  const channelName = kebabCase(data.name);
  const existsAlready = await prisma.channel.count({
    where: {
      name: channelName
    }
  }) > 0;

  if (existsAlready) {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  const createdChannel = await prisma.channel.create({
    data: {
      name: channelName,
      userId: user.id
    },
    select: {
      name: true
    }
  });

  return NextResponse.json({ success: true, channel: createdChannel });
}
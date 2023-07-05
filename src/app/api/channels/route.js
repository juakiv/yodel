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
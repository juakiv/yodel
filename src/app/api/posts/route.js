import { NextResponse } from "next/server";
import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request) {
  const posts = await prisma.post.findMany({
    orderBy: [
      {
        createdAt: "desc"
      }
    ],
    select: {
      id: true,
      content: true,
      color: true,
      createdAt: true
    },
    take: 10
  });

  return NextResponse.json(posts);
}

export async function POST(request) {
  const user = await validateServerSession();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const data = await request.json();

  if (data.content === null || data.content === "") {
    return NextResponse.json({ success: false }, { status: 422 });
  }
  
  if(!("color" in data) || !("color" in data && ["yellow", "red", "lilac", "aqua", "green"].includes(data.color))) {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content: data.content,
      color: data.color.toUpperCase()
    },
    select: {
      content: true,
      createdAt: true,
      color: true
    }
  });

  return NextResponse.json({ ...newPost });
}
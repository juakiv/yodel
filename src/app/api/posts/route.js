import { NextResponse } from "next/server";
import validateServerSession from "@/lib/server/validateServerSession";

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

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content: data.content
    },
    select: {
      content: true,
      createdAt: true
    }
  });

  return NextResponse.json({ ...newPost });
}
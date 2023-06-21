import { NextResponse } from "next/server";
import validateServerSession from "@/lib/server/validateServerSession";

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
    }
  });

  return NextResponse.json({ ...newPost });
}
import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function DELETE(request, { params }) {
  const user = await validateServerSession();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  
  const post = await prisma.post.findFirst({
    where: {
      id: parseInt(params.id),
      deletedAt: null
    }
  });
  
  if(!post) {
    return NextResponse.json({ success: false }, { status: 422 });
  }
  
  if(post.userId !== user.id) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await prisma.post.update({
    where: {
      id: parseInt(params.id)
    },
    data: {
      deletedAt: new Date().toISOString()
    }
  });

  return NextResponse.json({ success: true });
}
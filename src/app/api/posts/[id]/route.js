import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function DELETE(request, { params }) {
  const user = await validateServerSession();

  if (!user) {
    return NextResponse.json({ success: false, message: "Et ole kirjautunut sisään." }, { status: 401 });
  }
  
  const post = await prisma.post.findFirst({
    where: {
      id: parseInt(params.id),
      deletedAt: null
    }
  });
  
  if(!post) {
    return NextResponse.json({ success: false, message: "Viestiä ei löytynyt." }, { status: 422 });
  }
  
  if(post.userId !== user.id) {
    return NextResponse.json({ success: false, message: "Tämä viesti ei ole sinun." }, { status: 401 });
  }

  const deleteAndSelectParent = await prisma.post.update({
    where: {
      id: parseInt(params.id)
    },
    data: {
      deletedAt: new Date().toISOString()
    },
    select: {
      parentPostId: true
    }
  });

  if(deleteAndSelectParent && deleteAndSelectParent.parentPostId !== null) {
    await prisma.post.update({
      where: {
        id: deleteAndSelectParent.parentPostId
      },
      data: {
        commentsCount: {
          decrement: 1
        }
      }
    });
  }

  return NextResponse.json({ success: true });
}
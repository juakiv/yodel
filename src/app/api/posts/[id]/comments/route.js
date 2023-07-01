import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request, { params }) {
  const user = await validateServerSession();

  const posts = await prisma.post.findMany({
    where: {
      parentPostId: parseInt(params.id),
      deletedAt: null
    },
    orderBy: [
      {
        createdAt: "desc"
      }
    ],
    select: {
      id: true,
      content: true,
      color: true,
      createdAt: true,
      votes: {
        select: {
          type: true,
          userId: true
        }
      }
    },
    take: 10
  });

  const postsWithComputedData = posts.map(post => {
    return {
      ...post,
      myVote: user ? post.votes.find(vote => vote.userId === user.id)?.type || false : false,
      votes: post.votes.reduce((score, obj) => score + (obj.type === "UP" ? 1 : obj.type === "DOWN" ? -1 : 0), 0),
    }
  });

  return NextResponse.json(postsWithComputedData);
}
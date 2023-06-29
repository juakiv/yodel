import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";


export async function POST(request) {
  const user = await validateServerSession();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const data = await request.json();
  if (!["post", "type"].every(field => Object.keys(data).includes(field))) {
    return NextResponse.json({ success: false }, {
      status: 422
    });
  }

  if (!["UP", "DOWN"].includes(data.type)) {
    return NextResponse.json({ success: false }, {
      status: 422
    });
  }

  const vote = await prisma.vote.upsert({
    where: {
      userId_postId: {
        userId: user.id,
        postId: data.post
      }
    },
    update: {
      type: data.type
    },
    create: {
      postId: data.post,
      type: data.type,
      userId: user.id
    },
    select: {
      post: {
        select: {
          votes: true
        }
      }
    }
  });

  const calculatedVotes = vote.post.votes.reduce((score, obj) => score + (obj.type === "UP" ? 1 : obj.type === "DOWN" ? -1 : 0), 0);
  await prisma.post.update({
    where: {
      id: data.post
    },
    data: {
      votesCount: calculatedVotes
    }
  });

  return NextResponse.json({
    success: true,
    votes: calculatedVotes
  });
}
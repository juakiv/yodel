import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request) {
  const user = await validateServerSession();

  let infiniteLoadingClause = {};
  const params = request.nextUrl.searchParams;
  if(params.has("last") && parseInt(params.get("last")) > 0) {
    infiniteLoadingClause = {
      createdAt: {
        lt: new Date(parseInt(params.get("last"))).toISOString()
      }
    }
  }

  const posts = await prisma.post.findMany({
    where: {
      ...infiniteLoadingClause,
      parentPostId: null,
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
      userId: true,
      channel: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          comment: true
        }
      },
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
    const { userId, channel, ...postWithoutUserId } = post;
    return {
      ...postWithoutUserId,
      channel: channel?.name || "main",
      myPost: user && userId === user.id ? true : false,
      myVote: user ? post.votes.find(vote => vote.userId === user.id)?.type || false : false,
      votes: post.votes.reduce((score, obj) => score + (obj.type === "UP" ? 1 : obj.type === "DOWN" ? -1 : 0), 0),
    }
  });

  return NextResponse.json(postsWithComputedData);
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

  if (!("color" in data) || !("color" in data && ["yellow", "red", "lilac", "aqua", "green"].includes(data.color))) {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  const channel = 1;

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content: data.content,
      color: data.color.toUpperCase(),
      channelId: channel
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      color: true,
      _count: {
        select: {
          comment: true
        }
      },
    }
  });

  return NextResponse.json({ success: true, post: { ...newPost, votes: 0, myVote: false, myPost: true } });
}
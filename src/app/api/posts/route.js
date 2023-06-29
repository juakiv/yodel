import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request) {
  const user = await validateServerSession();

  let whereClause = {};
  const params = request.nextUrl.searchParams;
  if(params.has("last") && parseInt(params.get("last")) > 0) {
    whereClause = {
      createdAt: {
        lt: new Date(parseInt(params.get("last"))).toISOString()
      }
    }
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
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

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content: data.content,
      color: data.color.toUpperCase()
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      color: true
    }
  });

  return NextResponse.json({ success: true, post: { ...newPost, votes: 0, myVote: false } });
}
import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import prisma from "@/lib/server/prisma";

export async function GET(request) {
  const user = await validateServerSession();
  const params = request.nextUrl.searchParams;

  const sortType = params.get("sort") || "latest";
  const channel = params.get("channel") || "main";

  const channelClause = { channel: { name: channel } };
  let orderByClause = {};
  let infiniteLoadingClause = {};

  if(sortType === "mostCommented") {
    orderByClause = { commentsCount: "desc" }
  } else if(sortType === "mostLiked") {
    orderByClause = { votesCount: "desc" }
  }

  if(params.has("last") && parseInt(params.get("last")) > 0) {
    if(sortType === "latest") {
      infiniteLoadingClause = { createdAt: { lt: new Date(parseInt(params.get("last"))).toISOString() } }
    } else if(sortType === "mostLiked") {
      const lastVotes = parseInt(params.get("lastLike")) || 0;
      infiniteLoadingClause = {
        OR: [
          {
            votesCount: lastVotes,
            createdAt: {
              lt: new Date(parseInt(params.get("last"))).toISOString()
            }
          },
          {
            votesCount: {
              lt: lastVotes
            }
          }
        ]
      }
    } else if(sortType === "mostCommented") {
      const lastComments = parseInt(params.get("lastComment")) || 0;
      infiniteLoadingClause = {
        OR: [
          {
            commentsCount: lastComments,
            createdAt: {
              lt: new Date(parseInt(params.get("last"))).toISOString()
            }
          },
          {
            commentsCount: {
              lt: lastComments
            }
          }
        ]
      }
    }
  }

  const posts = await prisma.post.findMany({
    where: {
      ...infiniteLoadingClause,
      ...channelClause,
      parentPostId: null,
      deletedAt: null
    },
    orderBy: [
      orderByClause,
      {
        createdAt: "desc"
      },
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
          comment: {
            where: {
              deletedAt: null
            }
          }
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
    return NextResponse.json({ success: false, message: "Et ole kirjautunut sisään." }, { status: 401 });
  }

  const data = await request.json();

  if (data.content === null || data.content === "") {
    return NextResponse.json({ success: false, message: "Viesti on pakollinen." }, { status: 422 });
  }

  if(data.content.length > 240) {
    return NextResponse.json({ success: false, message: "Viesti on liian pitkä." }, { status: 422 });
  }

  if (!("color" in data) || !("color" in data && ["yellow", "red", "lilac", "aqua", "green"].includes(data.color)) || !"channel" in data) {
    return NextResponse.json({ success: false, message: "Viestin väri on virheellinen." }, { status: 422 });
  }
  
  const channel = await prisma.channel.findFirst({
    where: {
      name: data.channel
    },
    select: {
      name: true,
      id: true
    }
  });
  
  if(!channel) {
    return NextResponse.json({ success: false, message: "Kanavaa ei löytynyt." }, { status: 422 });
  }

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content: data.content,
      color: data.color.toUpperCase(),
      channelId: channel.id
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

  return NextResponse.json({ success: true, message: "success", post: { ...newPost, channel: channel.name, votes: 0, myVote: false, myPost: true } });
}
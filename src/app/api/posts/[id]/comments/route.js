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
        createdAt: "asc"
      }
    ],
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
      commentTag: true,
      parent: {
        select: {
          userId: true
        }
      },
      votes: {
        select: {
          type: true,
          userId: true
        }
      }
    }
  });

  const postsWithComputedData = posts.map(post => {
    let { userId, parent, ...postWithoutUser } = post;

    return {
      ...postWithoutUser,
      myPost: user && userId === user.id ? true : false,
      myVote: user ? post.votes.find(vote => vote.userId === user.id)?.type || false : false,
      votes: post.votes.reduce((score, obj) => score + (obj.type === "UP" ? 1 : obj.type === "DOWN" ? -1 : 0), 0),
    }
  });

  return NextResponse.json(postsWithComputedData);
}

export async function POST(request, { params }) {
  const user = await validateServerSession();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const data = await request.json();

  if (data.content === null || data.content === "") {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  const parentPost = await prisma.post.findFirst({
    where: {
      id: parseInt(params.id),
      deletedAt: null
    },
    select: {
      userId: true,
      comment: {
        select: {
          userId: true,
          commentTag: true
        }
      }
    }
  });

  if(!parentPost) {
    return NextResponse.json({ success: false }, { status: 422 });
  }

  let tag = 0;
  if(parentPost.userId !== user.id) {
    // onko käyttäjä osallistunut jo keskusteluun?
    let myCurrentTag = parentPost.comment.find(comment => comment.userId === user.id);
    if(myCurrentTag) {
      // on, annetaan vanha tagi
      tag = myCurrentTag.commentTag;
    } else {
      // ei ole, lasketaan uusi tagi
      tag = parentPost.comment.length > 0 ? Math.max(...parentPost.comment.map(comment => comment.commentTag)) + 1 : 1;
    }
  }
  
  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content: data.content,
      parentPostId: parseInt(params.id),
      commentTag: tag
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      commentTag: true
    }
  });

  return NextResponse.json({ success: true, post: { ...newPost, votes: 0, myVote: false, myPost: true } });
}
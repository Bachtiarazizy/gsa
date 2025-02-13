import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { discussionId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user already liked the discussion
    const existingLike = await prisma.discussionLike.findUnique({
      where: {
        userId_discussionId: {
          userId,
          discussionId,
        },
      },
    });

    if (existingLike) {
      // Unlike if already liked
      await prisma.discussionLike.delete({
        where: {
          userId_discussionId: {
            userId,
            discussionId,
          },
        },
      });
    } else {
      // Create new like
      await prisma.discussionLike.create({
        data: {
          userId,
          discussionId,
        },
      });
    }

    // Get updated discussion with likes and replies
    const updatedDiscussion = await prisma.discussion.findUnique({
      where: {
        id: discussionId,
      },
      include: {
        replies: {
          include: {
            likes: true,
          },
        },
        likes: true,
      },
    });

    return NextResponse.json(updatedDiscussion);
  } catch (error) {
    console.error("[DISCUSSIONS_LIKE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

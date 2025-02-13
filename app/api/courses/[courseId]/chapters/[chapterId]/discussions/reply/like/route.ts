import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { replyId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user already liked the reply
    const existingLike = await prisma.replyLike.findUnique({
      where: {
        userId_replyId: {
          userId,
          replyId,
        },
      },
    });

    if (existingLike) {
      // Unlike if already liked
      await prisma.replyLike.delete({
        where: {
          userId_replyId: {
            userId,
            replyId,
          },
        },
      });
    } else {
      // Create new like
      await prisma.replyLike.create({
        data: {
          userId,
          replyId,
        },
      });
    }

    // Get the reply and its parent discussion id
    const reply = await prisma.reply.findUnique({
      where: {
        id: replyId,
      },
      include: {
        likes: true,
      },
    });

    const discussionId = (
      await prisma.reply.findUnique({
        where: { id: replyId },
        select: { discussionId: true },
      })
    )?.discussionId;

    return NextResponse.json({
      discussionId,
      updatedReply: reply,
    });
  } catch (error) {
    console.error("[REPLY_LIKE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

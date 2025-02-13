import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, discussionId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        userId,
        discussionId,
      },
      include: {
        likes: true,
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("[DISCUSSIONS_REPLY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

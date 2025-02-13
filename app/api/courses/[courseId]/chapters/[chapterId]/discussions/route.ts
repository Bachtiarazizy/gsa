// app/api/courses/[courseId]/chapters/[chapterId]/discussions/route.ts
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    const { content } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        content,
        userId,
        chapterId: params.chapterId, // Use chapterId from URL params
      },
      include: {
        replies: true,
        likes: true,
      },
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.error("[DISCUSSIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

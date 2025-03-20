// app/api/courses/[courseId]/chapters/[chapterId]/progress/route.ts
import prisma from "@/lib/prisma/db";
import { createChapterProgressSchema } from "@/lib/zod-schema/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createChapterProgressSchema.parse(json);

    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted: body.isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted: body.isCompleted,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[CHAPTER_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

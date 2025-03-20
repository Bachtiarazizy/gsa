import prisma from "@/lib/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string; assessmentId: string } }) {
  try {
    const { userId } = await auth();
    const { score, isPassed, answers } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify course enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        },
      },
    });

    if (!enrollment) {
      return new NextResponse("Not enrolled", { status: 403 });
    }

    // Check if assessment exists and belongs to the chapter
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: params.assessmentId,
        chapterId: params.chapterId,
      },
    });

    if (!assessment) {
      return new NextResponse("Assessment not found", { status: 404 });
    }

    // Create or update assessment result
    const assessmentResult = await prisma.assessmentResult.upsert({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId: params.assessmentId,
        },
      },
      create: {
        userId,
        assessmentId: params.assessmentId,
        score,
        isPassed,
      },
      update: {
        score,
        isPassed,
      },
    });

    // If passed, mark chapter as completed
    if (isPassed) {
      await prisma.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId: params.chapterId,
          },
        },
        create: {
          userId,
          chapterId: params.chapterId,
          isCompleted: true,
        },
        update: {
          isCompleted: true,
        },
      });
    }

    return NextResponse.json(assessmentResult);
  } catch (error) {
    console.error("[ASSESSMENT_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

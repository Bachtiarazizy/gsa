import prisma from "@/lib/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateAssessmentSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().min(1),
      options: z.array(z.string()).min(2),
      correctAnswer: z.string().min(1),
    })
  ),
});

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string; assessmentId: string } }) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId, assessmentId } = params;
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate input data
    const validatedData = updateAssessmentSchema.safeParse(body);
    if (!validatedData.success) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // Check if the course exists and user is the owner
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the chapter exists and belongs to the course
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Check if the assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
        chapterId,
      },
    });

    if (!assessment) {
      return new NextResponse("Assessment not found", { status: 404 });
    }

    // Delete existing questions
    await prisma.question.deleteMany({
      where: {
        assessmentId,
      },
    });

    // Create new questions
    const questions = await Promise.all(
      validatedData.data.questions.map((question) =>
        prisma.question.create({
          data: {
            assessmentId,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
          },
        })
      )
    );

    return NextResponse.json({
      assessment,
      questions,
    });
  } catch (error) {
    console.error("[ASSESSMENT_ID_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const submitAssessmentSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string; assessmentId: string } }) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId, assessmentId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = submitAssessmentSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const { answers } = validatedData.data;

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return new NextResponse("Not enrolled in the course", { status: 403 });
    }

    // Get assessment with questions
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
        chapterId,
      },
      include: { questions: true },
    });

    if (!assessment) {
      return new NextResponse("Assessment not found", { status: 404 });
    }

    // Calculate score and track correct answers
    let correctAnswers = 0;
    const correctAnswerIds: string[] = [];

    assessment.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
        correctAnswerIds.push(question.id);
      }
    });

    const score = Math.round((correctAnswers / assessment.questions.length) * 100);
    const isPassed = score >= 70;

    // Create assessment result
    await prisma.assessmentResult.create({
      data: {
        userId,
        assessmentId,
        score,
        isPassed,
      },
    });

    // Update chapter progress if passed
    if (isPassed) {
      await prisma.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
        update: {
          isCompleted: true,
        },
        create: {
          userId,
          chapterId,
          isCompleted: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      score,
      isPassed,
      correctAnswers: correctAnswerIds,
    });
  } catch (error) {
    console.error("[ASSESSMENT_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

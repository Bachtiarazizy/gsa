import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

// Define validation schema for assessment
const assessmentSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question text is required"),
        options: z.array(z.string().min(1, "Option is required")).length(4),
        correctAnswer: z.string().min(1, "Correct answer is required"),
      })
    )
    .min(1, "At least one question is required"),
});

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify chapter exists and belongs to user
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: params.chapterId,
        course: {
          userId,
        },
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found or unauthorized", { status: 404 });
    }

    const json = await req.json();
    const validatedData = assessmentSchema.parse(json);

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        chapterId: params.chapterId,
        questions: {
          create: validatedData.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(assessment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[ASSESSMENT_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

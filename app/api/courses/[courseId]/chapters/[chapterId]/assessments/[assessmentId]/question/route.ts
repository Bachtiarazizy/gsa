import prisma from "@/lib/db";
import { createQuestionSchema } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { assessmentId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createQuestionSchema.parse(json);

    const question = await prisma.question.create({
      data: {
        question: body.question,
        options: body.options,
        correctAnswer: body.correctAnswer,
        assessmentId: params.assessmentId,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("[QUESTIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

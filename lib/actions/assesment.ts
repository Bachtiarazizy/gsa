"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma/db";
import { auth } from "@clerk/nextjs/server";
import { createQuestionSchema } from "../zod-schema/zodSchema";

export async function createAssessment(chapterId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const assessment = await prisma.assessment.create({
      data: {
        chapterId,
      },
    });

    revalidatePath(`/chapters/${chapterId}`);
    return { success: true, data: assessment };
  } catch (error) {
    console.error("[CREATE_ASSESSMENT]", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function createQuestion(assessmentId: string, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const values = {
      question: formData.get("question") as string,
      options: (formData.get("options") as string).split(","),
      correctAnswer: formData.get("correctAnswer") as string,
    };

    const validatedFields = createQuestionSchema.parse(values);

    const question = await prisma.question.create({
      data: {
        ...validatedFields,
        assessmentId,
      },
    });

    revalidatePath(`/assessments/${assessmentId}`);
    return { success: true, data: question };
  } catch (error) {
    console.error("[CREATE_QUESTION]", error);
    return { success: false, error: "Something went wrong" };
  }
}

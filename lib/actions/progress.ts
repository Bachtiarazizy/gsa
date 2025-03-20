"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma/db";

export async function updateChapterProgress(chapterId: string, isCompleted: boolean) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
      update: {
        isCompleted,
      },
    });

    revalidatePath(`/chapters/${chapterId}`);
    return { success: true, data: progress };
  } catch (error) {
    console.error("[UPDATE_PROGRESS]", error);
    return { success: false, error: "Something went wrong" };
  }
}

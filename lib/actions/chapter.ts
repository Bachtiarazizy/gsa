"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateChapterStatus(chapterId: string, courseId: string, isPublished: boolean) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify the chapter belongs to the course and the current user
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      course: true,
    },
  });

  if (!chapter || chapter.course.userId !== userId) {
    throw new Error("Chapter not found or unauthorized");
  }

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { isPublished },
  });

  // Revalidate the course page to reflect changes
  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
}

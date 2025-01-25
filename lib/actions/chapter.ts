"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function createChapter(courseId: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    // Prepare chapter data
    const chapterData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      videoUrl: formData.get("videoUrl") as string,
    };

    // Determine the next position for the chapter
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 0;

    // Create chapter in database
    const chapter = await prisma.chapter.create({
      data: {
        ...chapterData,
        courseId,
        position: newPosition,
        isPublished: false, // Default to draft
      },
    });

    // Revalidate course chapters page
    revalidatePath(`/courses/${courseId}`);

    return {
      success: true,
      data: {
        id: chapter.id,
      },
    };
  } catch (error) {
    console.error("Chapter creation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      error: "Failed to create chapter",
    };
  }
}

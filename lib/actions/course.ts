"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createCourseSchema } from "../zodSchema";
import { z } from "zod";

const prisma = new PrismaClient();

export async function getAllCourses() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.course.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      isPublished: true,
      enrollmentCount: true,
      price: true,
      createdAt: true,
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteCourse(courseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, userId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath("/courses");
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, userId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { isPublished },
  });

  revalidatePath("/courses");
}

export async function createCourse(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    // Parse form data
    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      imageUrl: formData.get("imageUrl") as string,
      price: Number(formData.get("price")),
      userId, // Add userId to the data
      isPublished: false, // Default to draft
    };

    // Validate data using the imported schema
    const validatedData = createCourseSchema.parse(courseData);

    // Create course in database
    const course = await prisma.course.create({
      data: validatedData,
    });

    // Revalidate courses page
    revalidatePath("/courses");

    return {
      success: true,
      data: {
        id: course.id,
      },
    };
  } catch (error) {
    console.error("Course creation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      error: "Failed to create course",
    };
  }
}

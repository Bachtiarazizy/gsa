"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

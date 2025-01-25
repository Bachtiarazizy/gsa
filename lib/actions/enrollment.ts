"use server";

import { revalidatePath } from "next/cache";
import prisma from "../db";
import { auth } from "@clerk/nextjs/server";

export async function enrollInCourse(courseId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true, data: enrollment };
  } catch (error) {
    console.error("[ENROLL_COURSE]", error);
    return { success: false, error: "Something went wrong" };
  }
}

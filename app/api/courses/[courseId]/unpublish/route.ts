import prisma from "@/lib/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PATCH: Unpublish a course
export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { courseId } = params; // Get courseId from URL params

    // Ensure the course belongs to the authenticated user
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 404 });
    }

    // Update the course's isPublished status to false
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: false },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[UNPUBLISH_COURSE_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

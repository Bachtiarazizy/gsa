import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }

    // Get the student profile for the user
    const studentProfile = await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!studentProfile) {
      throw new Error("Student profile not found. Please complete your profile first.");
    }

    // Create enrollment and increment count in a transaction
    await prisma.$transaction([
      prisma.courseEnrollment.create({
        data: {
          userId,
          courseId,
          studentProfileId: studentProfile.id,
        },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: { enrollmentCount: { increment: 1 } },
      }),
      // Create initial chapter progress for all published chapters
      prisma.chapterProgress.createMany({
        data: (
          await prisma.chapter.findMany({
            where: {
              courseId,
              isPublished: true,
            },
            select: { id: true },
          })
        ).map((chapter) => ({
          userId,
          chapterId: chapter.id,
          isCompleted: false,
        })),
      }),
    ]);

    revalidatePath(`/student/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[COURSE_ENROLLMENT]", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to enroll" };
  }
};

// Helper function to check enrollment status
export const getEnrollmentStatus = async (userId: string, courseId: string) => {
  try {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return {
      isEnrolled: !!enrollment,
      enrolledAt: enrollment?.createdAt,
    };
  } catch (error) {
    console.error("[GET_ENROLLMENT_STATUS]", error);
    return { isEnrolled: false, role: null, enrolledAt: null };
  }
};

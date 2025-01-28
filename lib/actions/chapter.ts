"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "../db";

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

export async function getStudentDashboardData(userId: string) {
  // Get enrolled courses
  const enrolledCourses = await prisma.courseEnrollment.findMany({
    where: {
      userId: userId,
      role: "STUDENT",
    },
    include: {
      course: true,
    },
  });

  // Get completed chapters
  const completedChapters = await prisma.chapterProgress.findMany({
    where: {
      userId: userId,
      isCompleted: true,
    },
  });

  // Get assessment results
  const assessmentResults = await prisma.assessmentResult.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get recent activities (combination of chapter completions, assessments, and enrollments)
  const recentEnrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId: userId,
    },
    include: {
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentCompletions = await prisma.chapterProgress.findMany({
    where: {
      userId: userId,
      isCompleted: true,
    },
    include: {
      chapter: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  const recentAssessments = await prisma.assessmentResult.findMany({
    where: {
      userId: userId,
    },
    include: {
      assessment: {
        include: {
          chapter: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Combine and sort recent activities
  const recentActivities = [
    ...recentEnrollments.map((enrollment) => ({
      id: enrollment.id,
      type: "ENROLLMENT",
      title: enrollment.course.title,
      createdAt: enrollment.createdAt,
    })),
    ...recentCompletions.map((completion) => ({
      id: completion.id,
      type: "COMPLETION",
      title: `${completion.chapter.course.title} - ${completion.chapter.title}`,
      createdAt: completion.updatedAt,
    })),
    ...recentAssessments.map((assessment) => ({
      id: assessment.id,
      type: "ASSESSMENT",
      title: `${assessment.assessment.chapter.course.title} - Assessment`,
      createdAt: assessment.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    enrolledCourses,
    completedChapters,
    assessmentResults,
    recentActivities,
  };
}

interface GetCourseWithChaptersProps {
  userId: string;
  courseId: string;
}

export const getCourseWithChapters = async ({ userId, courseId }: GetCourseWithChaptersProps) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            progress: {
              where: {
                userId,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        enrollments: {
          where: {
            userId,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return {
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        isCompleted: chapter.progress?.[0]?.isCompleted || false,
      })),
      isEnrolled: course.enrollments.length > 0,
    };
  } catch (error) {
    console.error("[GET_COURSE_WITH_CHAPTERS]", error);
    return null;
  }
};

interface UpdateChapterProgressParams {
  userId: string;
  chapterId: string;
  isCompleted: boolean;
}

export const getChapter = async ({ userId, courseId, chapterId }: { userId: string; courseId: string; chapterId: string }) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        title: true,
        id: true,
      },
    });

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      include: {
        assessment: {
          include: {
            questions: true,
          },
        },
        attachments: true,
        discussions: true,
      },
    });

    const nextChapter = await prisma.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter?.position ?? 0,
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    const userProgress = await prisma.chapterProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    const isEnrolled = await prisma.courseEnrollment.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    return {
      chapter,
      course,
      nextChapter,
      userProgress,
      isEnrolled: !!isEnrolled,
    };
  } catch (error) {
    console.error("[GET_CHAPTER]", error);
    throw error;
  }
};

interface UpdateChapterProgressParams {
  userId: string;
  chapterId: string;
  isCompleted: boolean;
}

export const updateChapterProgress = async ({ userId, chapterId, isCompleted }: UpdateChapterProgressParams) => {
  try {
    const userProgress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return userProgress;
  } catch (error) {
    console.error("[UPDATE_CHAPTER_PROGRESS]", error);
    throw error;
  }
};

export const submitAssessment = async ({ userId, chapterId, assessmentId, answers }: { userId: string; chapterId: string; assessmentId: string; answers: Record<string, string> }) => {
  try {
    // Get the assessment questions to check answers
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { questions: true },
    });

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    let correctAnswers = 0;
    assessment.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / assessment.questions.length) * 100);
    const isPassed = score >= 70;

    // Create assessment result
    const result = await prisma.assessmentResult.create({
      data: {
        userId,
        assessmentId,
        score,
        isPassed,
      },
    });

    // If passed, mark chapter as completed
    if (isPassed) {
      await prisma.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
        update: {
          isCompleted: true,
        },
        create: {
          userId,
          chapterId,
          isCompleted: true,
        },
      });
    }

    revalidatePath(`/courses/${chapterId}`);

    return { success: true, score, isPassed };
  } catch (error) {
    console.error("[SUBMIT_ASSESSMENT]", error);
    return { success: false, error: "Failed to submit assessment" };
  }
};

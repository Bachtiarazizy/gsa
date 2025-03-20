"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "../prisma/db";
import { GetChapterResponse } from "../types/chapter-types";

export async function updateChapterStatus(chapterId: string, courseId: string, isPublished: boolean) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

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
    const chapterData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      videoUrl: formData.get("videoUrl") as string,
      attachmentUrl: formData.get("attachmentUrl") as string | undefined,
      attachmentOriginalName: formData.get("attachmentOriginalName") as string | undefined,
    };

    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 0;

    const chapter = await prisma.chapter.create({
      data: {
        ...chapterData,
        courseId,
        position: newPosition,
        isPublished: false,
      },
    });

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
  const enrolledCourses = await prisma.courseEnrollment.findMany({
    where: {
      userId: userId,
      role: "STUDENT",
    },
    include: {
      course: true,
    },
  });

  const completedChapters = await prisma.chapterProgress.findMany({
    where: {
      userId: userId,
      isCompleted: true,
    },
  });

  const assessmentResults = await prisma.assessmentResult.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

  const recentActivities = [
    ...recentEnrollments.map((enrollment) => ({
      id: enrollment.id,
      type: "ENROLLMENT" as const,
      title: enrollment.course.title,
      createdAt: enrollment.createdAt,
    })),
    ...recentCompletions.map((completion) => ({
      id: completion.id,
      type: "COMPLETION" as const,
      title: `${completion.chapter.course.title} - ${completion.chapter.title}`,
      createdAt: completion.updatedAt,
    })),
    ...recentAssessments.map((assessment) => ({
      id: assessment.id,
      type: "ASSESSMENT" as const,
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
            assessment: true,
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

export const getChapter = async ({ userId, courseId, chapterId }: { userId: string; courseId: string; chapterId: string }): Promise<GetChapterResponse> => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        attachmentUrl: true,
        attachmentOriginalName: true,
        position: true,
        isPublished: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        assessment: {
          select: {
            id: true,
            chapterId: true,
            createdAt: true,
            updatedAt: true,
            questions: {
              select: {
                id: true,
                question: true,
                options: true,
                correctAnswer: true,
                assessmentId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        discussions: {
          select: {
            id: true,
            userId: true,
            content: true,
            courseId: true,
            chapterId: true,
            createdAt: true,
            updatedAt: true,
            replies: {
              select: {
                id: true,
                userId: true,
                content: true,
                discussionId: true,
                createdAt: true,
                updatedAt: true,
                likes: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
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
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        attachmentUrl: true,
        attachmentOriginalName: true,
        position: true,
        isPublished: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        assessment: {
          select: {
            id: true,
            chapterId: true,
            createdAt: true,
            updatedAt: true,
            questions: {
              select: {
                id: true,
                question: true,
                options: true,
                correctAnswer: true,
                assessmentId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        discussions: {
          select: {
            id: true,
            userId: true,
            content: true,
            courseId: true,
            chapterId: true,
            createdAt: true,
            updatedAt: true,
            replies: {
              select: {
                id: true,
                userId: true,
                content: true,
                discussionId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            likes: {
              select: {
                id: true,
                userId: true,
                discussionId: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // Get all user IDs from discussions and replies
    const userIds = new Set<string>();

    if (chapter?.discussions) {
      chapter.discussions.forEach((discussion) => {
        userIds.add(discussion.userId);

        if (discussion.replies) {
          discussion.replies.forEach((reply) => {
            userIds.add(reply.userId);
          });
        }
      });
    }

    if (nextChapter?.discussions) {
      nextChapter.discussions.forEach((discussion) => {
        userIds.add(discussion.userId);

        if (discussion.replies) {
          discussion.replies.forEach((reply) => {
            userIds.add(reply.userId);
          });
        }
      });
    }

    // Fetch student profiles for all these users
    const userProfiles = await prisma.studentProfile.findMany({
      where: {
        userId: {
          in: Array.from(userIds),
        },
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    // Create a lookup map
    const userProfileMap: Record<string, { firstName: string; lastName: string }> = {};
    userProfiles.forEach((profile) => {
      userProfileMap[profile.userId] = {
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
    });

    // Enhance discussions and replies with user profiles
    if (chapter?.discussions) {
      chapter.discussions = chapter.discussions.map((discussion) => ({
        ...discussion,
        userProfile: userProfileMap[discussion.userId] || null,
        replies:
          discussion.replies?.map((reply) => ({
            ...reply,
            userProfile: userProfileMap[reply.userId] || null,
          })) || [],
      }));
    }

    if (nextChapter?.discussions) {
      nextChapter.discussions = nextChapter.discussions.map((discussion) => ({
        ...discussion,
        userProfile: userProfileMap[discussion.userId] || null,
        replies:
          discussion.replies?.map((reply) => ({
            ...reply,
            userProfile: userProfileMap[reply.userId] || null,
          })) || [],
      }));
    }

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

export const submitAssessment = async ({ userId, chapterId, assessmentId, answers, courseId }: { userId: string; chapterId: string; assessmentId: string; answers: Record<string, string>; courseId: string }) => {
  try {
    // Add debug logging at the start
    console.log("Received submission data:", {
      userId,
      chapterId,
      assessmentId,
      answerCount: Object.keys(answers).length,
      courseId,
    });

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

    await prisma.assessmentResult.create({
      data: {
        userId,
        assessmentId,
        score,
        isPassed,
      },
    });

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

    // Use try-catch specifically for revalidatePath
    try {
      revalidatePath(`/student/courses/${courseId}/chapters/${chapterId}`);
    } catch (revalidateError) {
      console.error("Revalidation error:", revalidateError);
      // Continue execution even if revalidation fails
    }

    return { success: true, score, isPassed };
  } catch (error) {
    // More detailed error logging
    console.error("[SUBMIT_ASSESSMENT] Error details:", {
      error: error?.toString(),
      errorName: (error as Error)?.name,
      errorMessage: (error as Error)?.message,
      errorStack: (error as Error)?.stack,
      payload: {
        userId,
        chapterId,
        assessmentId,
        answerCount: answers ? Object.keys(answers).length : "no answers",
        courseId,
      },
    });
    return { success: false, error: "Failed to submit assessment" };
  }
};

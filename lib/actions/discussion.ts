"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "../db";

export async function createDiscussion(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const discussionData = {
      content: formData.get("content") as string,
      courseId: formData.get("courseId") as string,
      chapterId: formData.get("chapterId") as string | null,
      userId,
    };

    const discussion = await prisma.discussion.create({
      data: discussionData,
    });

    revalidatePath(`/courses/${discussionData.courseId}`);

    return {
      success: true,
      data: discussion,
    };
  } catch (error) {
    console.error("Discussion creation error:", error);
    return {
      success: false,
      error: "Failed to create discussion",
    };
  }
}

export async function createReply(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const replyData = {
      content: formData.get("content") as string,
      discussionId: formData.get("discussionId") as string,
      userId,
    };

    const reply = await prisma.reply.create({
      data: replyData,
    });

    revalidatePath(`/courses/${formData.get("courseId")}`);

    return {
      success: true,
      data: reply,
    };
  } catch (error) {
    console.error("Reply creation error:", error);
    return {
      success: false,
      error: "Failed to create reply",
    };
  }
}

export async function toggleLike(discussionId: string, type: "discussion" | "reply") {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    if (type === "discussion") {
      const existingLike = await prisma.discussionLike.findUnique({
        where: {
          userId_discussionId: {
            userId,
            discussionId,
          },
        },
      });

      if (existingLike) {
        await prisma.discussionLike.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        await prisma.discussionLike.create({
          data: {
            userId,
            discussionId,
          },
        });
      }
    } else {
      const existingLike = await prisma.replyLike.findUnique({
        where: {
          userId_replyId: {
            userId,
            replyId: discussionId, // In this case, discussionId is actually replyId
          },
        },
      });

      if (existingLike) {
        await prisma.replyLike.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        await prisma.replyLike.create({
          data: {
            userId,
            replyId: discussionId,
          },
        });
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Like toggle error:", error);
    return {
      success: false,
      error: "Failed to toggle like",
    };
  }
}

export async function getCourseDiscussions(courseId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.discussion.findMany({
    where: {
      courseId,
    },
    include: {
      replies: {
        include: {
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

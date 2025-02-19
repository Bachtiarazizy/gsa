// app/api/courses/[courseId]/chapters/[chapterId]/discussions/route.ts
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { content } = await req.json();
    const { courseId, chapterId } = params;

    // Create the discussion
    const discussion = await prisma.discussion.create({
      data: {
        content,
        userId,
        courseId,
        chapterId,
      },
    });

    // Fetch user profile
    const userProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    return Response.json({
      ...discussion,
      userProfile,
      replies: [],
      likes: [],
    });
  } catch (error) {
    console.error("[DISCUSSION_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

// GET endpoint to fetch discussions for a specific chapter
export async function GET(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { courseId, chapterId } = params;

    // Fetch discussions with related data
    const discussions = await prisma.discussion.findMany({
      where: {
        courseId,
        chapterId,
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

    // Fetch user profiles for all discussions
    const userIds = [...new Set([...discussions.map((d) => d.userId), ...discussions.flatMap((d) => d.replies.map((r) => r.userId))])];

    const userProfiles = await prisma.studentProfile.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    // Create a map of user profiles for easy lookup
    const userProfileMap = userProfiles.reduce((acc, profile) => {
      acc[profile.userId] = profile;
      return acc;
    }, {} as Record<string, { firstName: string; lastName: string }>);

    // Add user profile information to discussions and replies
    const discussionsWithProfiles = discussions.map((discussion) => ({
      ...discussion,
      userProfile: userProfileMap[discussion.userId] || null,
      replies: discussion.replies.map((reply) => ({
        ...reply,
        userProfile: userProfileMap[reply.userId] || null,
      })),
    }));

    return Response.json(discussionsWithProfiles);
  } catch (error) {
    console.error("[DISCUSSIONS_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

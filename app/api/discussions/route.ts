// app/api/discussions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma/db";
import { StudentProfile } from "@prisma/client";

// Define types for the query results
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DiscussionWithRelations = {
  id: string;
  userId: string;
  content: string;
  courseId: string | null;
  chapterId: string | null;
  createdAt: Date;
  updatedAt: Date;
  likes: {
    userId: string;
    createdAt: Date;
  }[];
  replies: {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    likes: {
      userId: string;
      createdAt: Date;
    }[];
  }[];
  userProfile: StudentProfile | null;
};

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const discussions = await prisma.discussion.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: {
          include: {
            likes: {
              select: {
                userId: true,
                createdAt: true,
              },
            },
          },
        },
        likes: {
          select: {
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    // Get all unique userIds from discussions and replies
    const userIds = new Set([...discussions.map((d) => d.userId), ...discussions.flatMap((d) => d.replies.map((r) => r.userId))]);

    // Fetch all relevant user profiles in a single query
    const userProfiles = await prisma.studentProfile.findMany({
      where: {
        userId: {
          in: Array.from(userIds),
        },
      },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // Create a map for quick profile lookup
    const userProfileMap = new Map(userProfiles.map((profile) => [profile.userId, profile]));

    // Transform the discussions with user profiles
    const transformedDiscussions = discussions.map((discussion) => ({
      ...discussion,
      courseId: discussion.courseId || null,
      chapterId: discussion.chapterId || null,
      userProfile: userProfileMap.get(discussion.userId) || null,
      replies: discussion.replies.map((reply) => ({
        ...reply,
        userProfile: userProfileMap.get(reply.userId) || null,
      })),
    }));

    return NextResponse.json(transformedDiscussions);
  } catch (error) {
    console.error("[DISCUSSIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

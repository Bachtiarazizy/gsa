// app/api/courses/[courseId]/chapters/[chapterId]/discussions/route.ts
import prisma from "@/lib/prisma/db";
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

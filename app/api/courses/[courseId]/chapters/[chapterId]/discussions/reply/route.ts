import prisma from "@/lib/prisma/db";
import { auth } from "@clerk/nextjs/server";

// In /api/courses/[courseId]/chapters/[chapterId]/discussions/reply/index.ts
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { discussionId, content } = await req.json();

    // Create the reply
    const reply = await prisma.reply.create({
      data: {
        content,
        userId,
        discussionId,
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
      ...reply,
      userProfile,
      likes: [],
    });
  } catch (error) {
    console.error("[REPLY_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

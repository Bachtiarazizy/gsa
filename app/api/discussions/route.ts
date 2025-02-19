// app/api/discussions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

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
        course: {
          select: {
            title: true,
          },
        },
        chapter: {
          select: {
            title: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            userId: true,
            createdAt: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    console.log("[DISCUSSIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, courseId, chapterId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        userId,
        content,
        courseId,
        chapterId,
      },
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.log("[DISCUSSIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

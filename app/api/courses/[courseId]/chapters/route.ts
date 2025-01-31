import prisma from "@/lib/db";
import { createChapterSchema } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const values = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoUrl: formData.get("videoUrl") as string,
      attachmentUrl: formData.get("attachmentUrl") as string, // Added attachmentUrl field
    };

    const body = createChapterSchema.parse(values);

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await prisma.chapter.create({
      data: {
        title: body.title,
        description: body.description,
        videoUrl: body.videoUrl,
        attachmentUrl: body.attachmentUrl, // Added attachmentUrl field
        position: newPosition,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTERS]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

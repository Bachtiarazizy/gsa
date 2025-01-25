import prisma from "@/lib/db";
import { createChapterSchema } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
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
      position: Number(formData.get("position")),
      isPublished: formData.get("isPublished") === "true",
    };

    if (!values.title || !values.videoUrl || !values.position) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate using the schema (excluding position and isPublished)
    const validatedFields = createChapterSchema.parse({
      title: values.title,
      description: values.description,
      videoUrl: values.videoUrl,
    });

    // First verify the course belongs to the user
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Then verify the chapter exists and belongs to the course
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Update the chapter
    const updatedChapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        title: validatedFields.title,
        description: validatedFields.description,
        videoUrl: validatedFields.videoUrl,
        position: values.position,
        isPublished: values.isPublished,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[CHAPTERS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

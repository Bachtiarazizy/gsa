// /api/courses/[courseId]/chapters/[chapterId]/route.ts

import prisma from "@/lib/prisma/db";
import { createChapterSchema } from "@/lib/zod-schema/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();

    // Get the rich text editor content directly
    const description = formData.get("description") as string;

    const values = {
      title: formData.get("title") as string,
      description: description, // This will contain HTML from the editor
      videoUrl: formData.get("videoUrl") as string,
      position: Number(formData.get("position")),
      isPublished: formData.get("isPublished") === "true",
      attachmentUrl: formData.get("attachmentUrl") as string | null,
      attachmentOriginalName: formData.get("attachmentOriginalName") as string | null,
    };

    if (!values.title || !values.videoUrl || !values.position) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate using the schema (excluding position and isPublished)
    // We need to ensure the schema allows HTML content
    const validatedFields = createChapterSchema.parse({
      title: values.title,
      description: values.description || null, // Handle empty strings correctly
      videoUrl: values.videoUrl,
      courseId: params.courseId,
      position: values.position,
      isPublished: values.isPublished,
      attachmentUrl: values.attachmentUrl,
      attachmentOriginalName: values.attachmentOriginalName,
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

    // Update the chapter with rich text content
    const updatedChapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        title: validatedFields.title,
        description: validatedFields.description, // Store HTML content from the editor
        videoUrl: validatedFields.videoUrl,
        position: values.position,
        isPublished: values.isPublished,
        attachmentUrl: validatedFields.attachmentUrl,
        attachmentOriginalName: validatedFields.attachmentOriginalName,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[CHAPTERS_UPDATE]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

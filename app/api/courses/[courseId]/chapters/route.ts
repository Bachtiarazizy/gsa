// /api/courses/[courseId]/chapters/route.ts

import prisma from "@/lib/prisma/db";
import { createChapterSchema } from "@/lib/zod-schema/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const attachmentsString = formData.get("attachments") as string;
    let attachments = [];

    try {
      attachments = JSON.parse(attachmentsString || "[]");
    } catch (e) {
      console.error("Error parsing attachments:", e);
    }

    // Get the description from the rich text editor (HTML content)
    const description = formData.get("description") as string;

    const values = {
      title: formData.get("title") as string,
      description: description || null, // Store HTML content from the editor
      videoUrl: formData.get("videoUrl") as string,
      position: parseInt(formData.get("position") as string) || 0,
      courseId: params.courseId,
      isPublished: false,
    };

    // Validate the input data against the schema
    const validatedData = createChapterSchema.parse(values);

    // Verify course ownership
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // Get the last chapter position if position is not provided
    if (!validatedData.position) {
      const lastChapter = await prisma.chapter.findFirst({
        where: {
          courseId: params.courseId,
        },
        orderBy: {
          position: "desc",
        },
      });

      validatedData.position = lastChapter ? lastChapter.position + 1 : 1;
    }

    // Create the chapter with the first attachment (if any)
    const chapter = await prisma.chapter.create({
      data: {
        title: validatedData.title,
        description: validatedData.description, // Store HTML content
        videoUrl: validatedData.videoUrl,
        position: validatedData.position,
        courseId: validatedData.courseId,
        isPublished: validatedData.isPublished,
        // If there are attachments, store the first one's URL and name
        attachmentUrl: attachments[0]?.url || null,
        attachmentOriginalName: attachments[0]?.name || null,
      },
    });

    // If creation was successful, update the course
    await prisma.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTERS]", error);

    // Type guard for ZodError
    if (error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({
          message: "Validation Error",
          errors: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle Prisma errors or other known error types if needed
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }

    // Generic error handling
    return new NextResponse(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

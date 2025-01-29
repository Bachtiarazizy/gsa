// app/api/courses/[courseId]/route.ts
import prisma from "@/lib/db";
import { updateCourseSchema } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      imageUrl: formData.get("imageUrl"),
      price: Number(formData.get("price")),
      categoryId: formData.get("categoryId"),
      attachments: JSON.parse((formData.get("attachments") as string) || "[]"),
    };

    const validatedData = updateCourseSchema.parse(data);

    // Verify category exists
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: validatedData.categoryId,
        },
      });

      if (!category) {
        return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
      }
    }

    // Start a transaction to handle attachments update
    const course = await prisma.$transaction(async (tx) => {
      // Delete existing attachments
      await tx.attachment.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });

      // Update course with new attachments
      return tx.course.update({
        where: {
          id: params.courseId,
          userId,
        },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          imageUrl: validatedData.imageUrl,
          price: validatedData.price,
          categoryId: validatedData.categoryId,
          attachments: {
            createMany: {
              data: validatedData.attachments.map((attachment) => ({
                name: attachment.name,
                url: attachment.url,
              })),
            },
          },
        },
        include: {
          category: true,
          attachments: true,
          _count: {
            select: {
              chapters: true,
              enrollments: true,
            },
          },
        },
      });
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_UPDATE]", error);

    if (error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid data",
          errors: error.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        category: true,
        attachments: true,
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        _count: {
          select: {
            chapters: true,
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse(JSON.stringify({ message: "Course not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID_GET]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete course and all related data
    const course = await prisma.course.delete({
      where: {
        id: params.courseId,
        userId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

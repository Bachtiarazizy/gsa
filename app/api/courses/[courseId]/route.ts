import prisma from "@/lib/db";
import { updateCourseSchema } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const data = {
      title: json.title,
      description: json.description,
      duration: json.duration,
      imageUrl: json.imageUrl,
      attachmentUrl: json.attachmentUrl,
      attachmentOriginalName: json.attachmentOriginalName,
      price: Number(json.price),
      categoryId: json.categoryId,
    };

    const validatedData = updateCourseSchema.parse(data);

    // Verify course exists and belongs to user
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!existingCourse) {
      return new NextResponse(JSON.stringify({ message: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify category if it's being updated
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: validatedData.categoryId,
        },
      });

      if (!category) {
        return new NextResponse(JSON.stringify({ message: "Category not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: validatedData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

// /api/courses/route.ts

import prisma from "@/lib/db";
import { createCourseSchema, updateCourseSchema } from "@/lib/zodSchema";
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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const data = {
      userId,
      title: json.title,
      description: json.description, // This can now contain HTML from the rich text editor
      duration: json.duration,
      imageUrl: json.imageUrl,
      attachmentUrl: json.attachmentUrl,
      attachmentOriginalName: json.attachmentOriginalName,
      price: Number(json.price),
      categoryId: json.categoryId,
      isPublished: false,
    };

    const validatedData = createCourseSchema.parse(data);

    // Verify category exists
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

    // Create course with all fields from schema
    const course = await prisma.course.create({
      data: {
        userId: validatedData.userId,
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        imageUrl: validatedData.imageUrl,
        attachmentUrl: validatedData.attachmentUrl,
        attachmentOriginalName: validatedData.attachmentOriginalName,
        price: validatedData.price,
        isPublished: validatedData.isPublished,
        categoryId: validatedData.categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isPublished = searchParams.get("isPublished");

    const courses = await prisma.course.findMany({
      where: {
        userId,
        ...(categoryId && { categoryId }),
        ...(isPublished && { isPublished: isPublished === "true" }),
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

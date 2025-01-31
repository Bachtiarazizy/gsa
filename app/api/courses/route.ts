import prisma from "@/lib/db";
import { createCourseSchema } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
      attachmentUrl: formData.get("attachmentUrl"), // Updated to single attachmentUrl
    };

    const validatedData = createCourseSchema.parse(data);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: {
        id: validatedData.categoryId,
      },
    });

    if (!category) {
      return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // Create course with single attachmentUrl
    const course = await prisma.course.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        price: validatedData.price,
        isPublished: false,
        categoryId: validatedData.categoryId,
        attachmentUrl: validatedData.attachmentUrl, // Updated to single attachmentUrl
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
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

    const courses = await prisma.course.findMany({
      where: {
        userId,
        ...(categoryId && {
          categoryId: categoryId,
        }),
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
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

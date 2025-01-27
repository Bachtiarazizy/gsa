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

    const json = await req.json();
    const body = createCourseSchema.parse(json);

    // Verify that the category exists
    const category = await prisma.category.findUnique({
      where: {
        id: body.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const course = await prisma.course.create({
      data: {
        userId,
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        price: body.price,
        isPublished: false,
        categoryId: body.categoryId, // Add category relation
      },
      include: {
        category: true, // Include category in response
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
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
        // Add optional category filter
        ...(categoryId && {
          categoryId: categoryId,
        }),
      },
      include: {
        category: true, // Include category
        chapters: true,
        enrollments: true,
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Optional: Add an endpoint to get categories
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET_CATEGORIES(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

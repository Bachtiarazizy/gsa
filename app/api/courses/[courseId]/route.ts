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
      isPublished: formData.get("isPublished") === "true",
      categoryId: formData.get("categoryId"), // Add categoryId handling
    };

    const validatedData = updateCourseSchema.parse(data);

    // Verify category exists if categoryId is provided
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: validatedData.categoryId,
        },
      });

      if (!category) {
        return new NextResponse(
          JSON.stringify({
            message: "Category not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    const course = await prisma.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: validatedData,
      include: {
        category: true, // Include category in response
        _count: {
          select: {
            chapters: true,
            enrollments: true,
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error: unknown) {
    console.error("[COURSE_UPDATE]", error);

    if (error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid data",
          errors: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({
          message: error.message || "Internal Server Error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Add a GET endpoint to fetch a single course with category
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
        chapters: true,
        enrollments: true,
        _count: {
          select: {
            chapters: true,
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse(JSON.stringify({ message: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID_GET]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

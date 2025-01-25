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
      isPublished: formData.get("isPublished") === "true",
    };

    const validatedData = updateCourseSchema.parse(data);

    const course = await prisma.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: validatedData,
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

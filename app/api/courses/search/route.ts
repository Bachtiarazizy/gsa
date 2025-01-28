// app/api/courses/search/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const categoryId = searchParams.get("category") || "";

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: query,
          mode: "insensitive",
        },
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

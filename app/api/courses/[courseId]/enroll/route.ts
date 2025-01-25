// app/api/courses/[courseId]/enroll/route.ts
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[ENROLLMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        },
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[ENROLLMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

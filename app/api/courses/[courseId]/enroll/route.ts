import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { enrollInCourse } from "@/lib/actions/enrollment";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success, error } = await enrollInCourse(userId, params.courseId);

    if (!success) {
      return NextResponse.json({ error: error || "Failed to enroll" }, { status: 500 });
    }

    return NextResponse.json({ message: "Successfully enrolled" }, { status: 200 });
  } catch (error) {
    console.log("[COURSE_ID_ENROLL]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

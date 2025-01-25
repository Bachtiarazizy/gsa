// app/courses/[courseId]/edit/page.tsx
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditCourseForm from "@/components/forms/edit-course-form";
import { auth } from "@clerk/nextjs/server";

export default async function CourseEditPage({ params }: { params: { courseId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
  });

  if (!course) {
    return redirect("/courses");
  }

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to courses
            </Button>
          </Link>
          <div className="flex items-center gap-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Edit Course</h1>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <EditCourseForm initialData={course} />
        </div>
      </div>
    </div>
  );
}

// app/(admin)/courses/create/page.tsx
import { Metadata } from "next";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateCourseForm from "@/components/forms/course-form";

export const metadata: Metadata = {
  title: "Create a New Course",
  description: "Create a new course for your students",
};

export default function CreateCoursePage() {
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
            <h1 className="text-2xl font-bold">Create a New Course</h1>
          </div>
          <p className="text-sm text-muted-foreground">Complete the form below to create a new course. You can edit the course details later.</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Course Details</h2>
              <p className="text-sm text-muted-foreground">Fill in the information below to create your new course</p>
            </div>
            <CreateCourseForm />
          </div>
        </div>
      </div>
    </div>
  );
}

// app/(admin)/courses/[courseId]/chapters/create/page.tsx
import { Metadata } from "next";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import CreateChapterForm from "@/components/forms/chapter-form";

interface CreateChapterPageProps {
  params: {
    courseId: string;
  };
}

export const metadata: Metadata = {
  title: "Create a New Chapter - Admin Dashboard",
  description: "Add a new chapter to your course",
};

export default async function CreateChapterPage({ params }: CreateChapterPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    select: {
      title: true,
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href={`/admin/courses/${params.courseId}`}>
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course
            </Button>
          </Link>
          <div className="flex items-center gap-x-2">
            <BookOpen className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Add a New Chapter</h1>
              <p className="text-sm text-muted-foreground">to {course.title}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Create an engaging chapter with video content and descriptions</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Chapter Details</h2>
              <p className="text-sm text-muted-foreground">Fill in the information below to create your new chapter</p>
            </div>
            <CreateChapterForm courseId={params.courseId} />
          </div>
        </div>
      </div>
    </div>
  );
}

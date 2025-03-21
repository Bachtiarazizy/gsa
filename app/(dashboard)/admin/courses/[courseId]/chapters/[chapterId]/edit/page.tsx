import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/db";
import EditChapterForm from "@/components/forms/edit-chapter-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Chapter - Admin Dashboard",
  description: "Modify your existing chapter details",
};

export default async function ChapterEditPageServer({ params }: { params: { courseId: string; chapterId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      course: {
        select: {
          userId: true,
          title: true,
        },
      },
    },
  });

  if (!chapter || chapter.course.userId !== userId) {
    return redirect("/admin/courses");
  }

  const transformedChapter = {
    id: chapter.id,
    title: chapter.title,
    description: chapter.description,
    videoUrl: chapter.videoUrl,
    position: chapter.position,
    isPublished: chapter.isPublished,
    courseId: chapter.courseId,
    attachmentUrl: chapter.attachmentUrl,
    attachmentOriginalName: chapter.attachmentOriginalName,
    course: {
      title: chapter.course.title,
    },
  };

  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href={`/admin/courses/${params.courseId}/chapters/${params.chapterId}`}>
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to chapters
            </Button>
          </Link>
          <div className="flex items-center gap-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Edit Chapter</h1>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <EditChapterForm initialData={transformedChapter} />
        </div>
      </div>
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, FileEdit, ClipboardList } from "lucide-react";

interface PageProps {
  params: {
    courseId: string;
    chapterId: string;
    assessmentId: string;
  };
}

export default async function ChapterDetailsPage({ params }: PageProps) {
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
      assessment: {
        select: {
          id: true,
          questions: true,
        },
      },
    },
  });

  if (!chapter || chapter.course.userId !== userId) {
    return redirect("/courses");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-x-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{chapter.title}</h1>
        </div>
        <Link href={`/admin/courses/${params.courseId}/chapters/${params.chapterId}/edit`}>
          <Button className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Edit Chapter
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chapter Information</CardTitle>
            <CardDescription>Details about this chapter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{chapter.description || "No description provided"}</p>
            </div>
            <div>
              <h3 className="font-medium">Position</h3>
              <p className="text-sm text-muted-foreground">Chapter {chapter.position}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-sm text-muted-foreground">{chapter.isPublished ? "Published" : "Draft"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Content</CardTitle>
            <CardDescription>Chapter video information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapter.videoUrl ? (
              <div className="aspect-video relative">
                <video src={chapter.videoUrl} controls className="w-full rounded-lg" poster="/api/placeholder/640/360">
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex items-center justify-center aspect-video bg-slate-100 rounded-lg">
                <div className="flex flex-col items-center text-slate-500">
                  <Video className="h-10 w-10 mb-2" />
                  <p>No video uploaded</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment</CardTitle>
            <CardDescription>Chapter assessment details</CardDescription>
          </CardHeader>
          <CardContent>
            {chapter.assessment ? (
              <div>
                <p className="text-sm">Questions: {chapter.assessment.questions.length}</p>
                <Link href={`/admin/courses/${params.courseId}/chapters/${params.chapterId}/assessments/${chapter.assessment.id}/edit`}>
                  <Button variant="outline" className="mt-2 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Edit Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href={`/admin/courses/${params.courseId}/chapters/${params.chapterId}/assessments/create`}>
                <Button className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Create Assessment
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>This chapter belongs to</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/courses/${params.courseId}`} className="text-blue-600 hover:underline flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {chapter.course.title}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

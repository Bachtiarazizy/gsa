import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import EditAssessmentForm from "@/components/forms/edit-assessment-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList } from "lucide-react";

export default async function AssessmentEditPageServer({ params }: { params: { courseId: string; chapterId: string; assessmentId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const assessment = await prisma.assessment.findUnique({
    where: {
      id: params.assessmentId,
      chapterId: params.chapterId,
    },
    include: {
      chapter: {
        select: {
          course: {
            select: {
              userId: true,
              title: true,
            },
          },
        },
      },
      questions: true,
    },
  });

  if (!assessment || assessment.chapter.course.userId !== userId) {
    return redirect("/courses");
  }

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href={`/courses/${params.courseId}/chapters/${params.chapterId}`}>
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapter
            </Button>
          </Link>
          <div className="flex items-center gap-x-2">
            <ClipboardList className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Edit Assessment</h1>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <EditAssessmentForm
            initialData={{
              id: assessment.id,
              questions: assessment.questions,
              chapterId: params.chapterId,
            }}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
        </div>
      </div>
    </div>
  );
}

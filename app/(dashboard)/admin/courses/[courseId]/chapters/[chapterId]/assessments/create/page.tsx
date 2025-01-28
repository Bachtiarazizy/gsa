import AssessmentForm from "@/components/forms/assessment-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function ChapterAssessmentPage({ params }: { params: { courseId: string; chapterId: string } }) {
  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
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
            <h1 className="text-2xl font-bold">Create an Assesment</h1>
          </div>
          <p className="text-sm text-muted-foreground">Complete the form below to create a new Assessment. You can edit the assessment details later.</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Assessment Details</h2>
              <p className="text-sm text-muted-foreground">Fill in the information below to create your new assessment</p>
            </div>
            <AssessmentForm courseId={params.courseId} chapterId={params.chapterId} />
          </div>
        </div>
      </div>
    </div>
  );
}

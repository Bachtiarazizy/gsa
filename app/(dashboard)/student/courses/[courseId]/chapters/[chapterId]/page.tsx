// ChapterPage.tsx
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/lib/actions/chapter";
import { Banner } from "@/components/ui/banner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/ui/preview";
import { Separator } from "@/components/ui/separator";
import { Attachments } from "@/app/(dashboard)/student/courses/_components/attachment";
import { VideoPlayer } from "@/app/(dashboard)/student/courses/_components/video-player";
import { ChapterAssessment } from "@/app/(dashboard)/student/courses/_components/chapter-assessment";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course, nextChapter, userProgress, isEnrolled } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  if (!isEnrolled) {
    return redirect(`/student/courses/${params.courseId}`);
  }

  return (
    <div className="min-h-full">
      {userProgress?.isCompleted && <Banner variant="success" label="You already completed this chapter." />}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
              <div className="text-sm text-muted-foreground mb-4">{course.title}</div>
            </div>
            {nextChapter && userProgress?.isCompleted && (
              <Button onClick={() => redirect(`/student/courses/${params.courseId}/chapters/${nextChapter.id}`)} className="flex items-center gap-2">
                Next Chapter
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {chapter.videoUrl && <VideoPlayer videoUrl={chapter.videoUrl} chapterId={params.chapterId} userId={userId} isCompleted={!!userProgress?.isCompleted} hasAssessment={!!chapter.assessment} />}

          <div className="flex flex-col gap-2 mt-8">
            <Preview value={chapter.description || ""} />
          </div>

          <Attachments attachments={chapter.attachments} />

          {!userProgress?.isCompleted && chapter.assessment && <ChapterAssessment assessment={chapter.assessment} chapterId={params.chapterId} userId={userId} />}

          {chapter.discussions?.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-col gap-y-4">
                <h3 className="text-xl font-semibold">Discussion</h3>
                {/* Add your Discussion component here */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;

import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/lib/actions/chapter";
import { Banner } from "@/components/ui/banner";
import { Preview } from "@/components/ui/preview";
import { VideoPlayer } from "@/app/(dashboard)/student/courses/_components/video-player";
import Link from "next/link";
import ClientDiscussions from "../../../_components/client-discussion";
import { Assessment, Discussion } from "@/lib/types";
import NextChapterNavigation from "../../../_components/next-chapter-button";
import { FileText } from "lucide-react";
import ChapterAssessment from "../../../_components/chapter-assessment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter | Global Skills Academy",
  description: "Learn something new today",
};

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  attachmentUrl: string | null;
  attachmentOriginalName: string | null;
  position: number;
  isPublished: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  assessment: Assessment | null;
  discussions: Discussion[] | null;
}

interface Course {
  id: string;
  title: string;
}

interface GetChapterResponse {
  chapter: Chapter | null;
  course: Course | null;
  nextChapter: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    attachmentUrl: string | null;
    attachmentOriginalName: string | null;
    position: number;
    isPublished: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
    assessment: Assessment | null;
    discussions: Discussion[] | null;
  } | null;
  userProgress: { isCompleted: boolean } | null;
  isEnrolled: boolean;
}

const ChapterIdPage = async ({ params }: ChapterPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course, nextChapter, userProgress, isEnrolled }: GetChapterResponse = await getChapter({
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
            {nextChapter && userProgress?.isCompleted && <NextChapterNavigation courseId={params.courseId} nextChapterId={nextChapter.id} />}
          </div>

          {chapter.videoUrl && <VideoPlayer videoUrl={chapter.videoUrl} chapterId={params.chapterId} userId={userId} isCompleted={!!userProgress?.isCompleted} hasAssessment={!!chapter.assessment} />}

          <div className="flex flex-col gap-2 mt-8">
            <Preview value={chapter.description || ""} />
          </div>

          {chapter.attachmentUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Chapter Resources</h3>
              <Link href={chapter.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 w-full bg-sky-50 border border-sky-200 text-sky-700 rounded-md hover:bg-sky-100 transition">
                <FileText className="h-4 w-4 flex-shrink-0 mr-2" />
                <span className="text-sm line-clamp-1">{chapter.attachmentOriginalName || "Download Resource"}</span>
              </Link>
            </div>
          )}

          {!userProgress?.isCompleted && chapter.assessment && (
            <div className="mt-8">
              <ChapterAssessment assessment={chapter.assessment} chapterId={params.chapterId} courseId={params.courseId} />
            </div>
          )}

          {chapter.discussions && <ClientDiscussions initialDiscussions={chapter.discussions} userId={userId} courseId={params.courseId} chapterId={params.chapterId} />}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;

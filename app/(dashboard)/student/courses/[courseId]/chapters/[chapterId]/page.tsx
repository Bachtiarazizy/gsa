import React, { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/lib/actions/chapter";
import { Banner } from "@/components/ui/banner";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/app/(dashboard)/student/courses/_components/video-player";
import Link from "next/link";
import ClientDiscussions from "../../../_components/client-discussion";
import NextChapterNavigation from "../../../_components/next-chapter-button";
import { FileText } from "lucide-react";
import ChapterAssessment from "../../../_components/chapter-assessment";
import { Metadata } from "next";
import { CompactRichTextPreview } from "@/app/(dashboard)/admin/courses/_components/preview";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma/db";

export const metadata: Metadata = {
  title: "Chapter | Global Skills Academy",
  description: "Learn something new today",
};

function ChapterSkeleton() {
  return (
    <div className="min-h-full">
      <div className="flex flex-col max-w-5xl mx-auto pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-10 w-[150px]" />
          </div>

          {/* Video Player Skeleton */}
          <div className="relative aspect-video w-full bg-slate-200 rounded-md">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Description Skeleton */}
          <div className="mt-8 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>

          {/* Resources Skeleton */}
          <div className="mt-6">
            <Skeleton className="h-6 w-[150px] mb-2" />
            <div className="flex items-center p-3 w-full border rounded-md">
              <FileText className="h-4 w-4 flex-shrink-0 mr-2 text-gray-300" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          {/* Assessment Skeleton */}
          <div className="mt-8">
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-[200px] mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Discussions Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-6 w-[150px] mb-4" />
            <div className="space-y-4">
              {[1, 2].map((index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[90%]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

async function ChapterContent({ userId, courseId, chapterId }: { userId: string; courseId: string; chapterId: string }) {
  const { chapter, course, nextChapter, userProgress, isEnrolled } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  if (!isEnrolled) {
    return redirect(`/student/courses/${courseId}`);
  }

  // Check if all chapters are completed (for this, we need to query the database)
  // This would ideally be included in the getChapter function, but we're adding it here
  const allChaptersProgress = await prisma.chapterProgress.findMany({
    where: {
      userId,
      chapter: {
        courseId: courseId,
      },
    },
    include: {
      chapter: true,
    },
  });

  const publishedChapters = await prisma.chapter.count({
    where: {
      courseId,
      isPublished: true,
    },
  });

  const completedChapters = allChaptersProgress.filter((progress) => progress.isCompleted).length;
  const allChaptersCompleted = completedChapters === publishedChapters && completedChapters > 0;

  // Check if this is the last chapter
  const isLastChapter = !nextChapter;
  const isCourseCompleted = userProgress?.isCompleted && isLastChapter && allChaptersCompleted;

  // Check if research paper exists
  const existingResearchPaper = await prisma.researchPaper.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  // Flag to check if course requires research paper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requiresResearchPaper = (course as any).requiresResearchPaper || false;

  const handleCourseCompletion = async () => {
    "use server";

    // Get the student profile ID
    const studentProfile = await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!studentProfile) {
      throw new Error("Student profile not found");
    }

    // Mark the course enrollment as completed
    await prisma.courseEnrollment.updateMany({
      where: {
        userId,
        courseId,
      },
      data: {
        completed: true,
      },
    });

    // If the course requires a research paper, create a draft research paper
    if (requiresResearchPaper && !existingResearchPaper) {
      await prisma.researchPaper.create({
        data: {
          userId,
          courseId,
          studentProfileId: studentProfile.id,
          title: `Research Paper for ${course.title}`,
          abstract: "",
          content: "",
          status: "DRAFT",
        },
      });
    }

    return redirect(`/student/courses/${courseId}/research-paper`);
  };

  return (
    <div className="min-h-full">
      {userProgress?.isCompleted && !isLastChapter && <Banner variant="success" label="You already completed this chapter." />}

      {isCourseCompleted && requiresResearchPaper && !existingResearchPaper && (
        <Banner variant="success" label="Congratulations! You have completed all chapters in this course. Submit a research paper to finalize your course completion." />
      )}

      {isCourseCompleted && requiresResearchPaper && existingResearchPaper && (
        <Banner variant="success" label={`Congratulations! You have completed all chapters in this course. Your research paper is in ${existingResearchPaper.status.toLowerCase()} status.`} />
      )}

      {isCourseCompleted && !requiresResearchPaper && <Banner variant="success" label="Congratulations! You have successfully completed this course." />}

      <div className="flex flex-col max-w-5xl mx-auto pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
              <div className="text-sm text-muted-foreground mb-4">{course.title}</div>
            </div>
            {nextChapter && userProgress?.isCompleted && <NextChapterNavigation courseId={courseId} nextChapterId={nextChapter.id} />}
            {isCourseCompleted && requiresResearchPaper && (
              <form action={handleCourseCompletion}>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  {existingResearchPaper ? "Continue Research Paper" : "Start Research Paper"}
                </Button>
              </form>
            )}
            {isCourseCompleted && !requiresResearchPaper && (
              <form action={handleCourseCompletion}>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Complete Course
                </Button>
              </form>
            )}
          </div>

          {chapter.videoUrl && <VideoPlayer videoUrl={chapter.videoUrl} chapterId={chapterId} userId={userId} isCompleted={!!userProgress?.isCompleted} hasAssessment={!!chapter.assessment} />}

          <div className="flex flex-col gap-2 mt-8">
            {chapter.description ? <CompactRichTextPreview content={chapter.description} className="text-sm text-muted-foreground line-clamp-1" /> : <p className="text-sm text-muted-foreground line-clamp-2">No description available</p>}
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
              <ChapterAssessment assessment={chapter.assessment} chapterId={chapterId} courseId={courseId} />
            </div>
          )}

          {chapter.discussions && <ClientDiscussions initialDiscussions={chapter.discussions} userId={userId} courseId={courseId} chapterId={chapterId} />}
        </div>
      </div>
    </div>
  );
}

const ChapterIdPage = async ({ params }: ChapterPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <Suspense fallback={<ChapterSkeleton />}>
      <ChapterContent userId={userId} courseId={params.courseId} chapterId={params.chapterId} />
    </Suspense>
  );
};

export default ChapterIdPage;

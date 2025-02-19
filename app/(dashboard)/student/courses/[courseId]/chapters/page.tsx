import { redirect } from "next/navigation";
import { File, CheckCircle, PlayCircle, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { getCourseWithChapters } from "@/lib/actions/chapter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Chapters | Global Skills Academy",
  description: "Learn something new today",
};

interface CourseChaptersPageProps {
  params: {
    courseId: string;
  };
}

const CourseChaptersPage = async ({ params }: CourseChaptersPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await getCourseWithChapters({
    userId,
    courseId: params.courseId,
  });

  if (!course) {
    return redirect("/");
  }

  const completedChapters = course.chapters.filter((chapter) => chapter.isCompleted);
  const progressPercentage = (completedChapters.length / course.chapters.length) * 100;

  // Function to check if a chapter should be locked
  const isChapterLocked = (index: number) => {
    if (index === 0) return false; // First chapter is always unlocked
    return !course.chapters[index - 1].isCompleted; // Lock if previous chapter isn't completed
  };

  const ChapterCard = ({ chapter, index }: { chapter: any; index: number }) => {
    const locked = isChapterLocked(index);
    const content = (
      <Card className={`${locked ? "opacity-75" : "hover:shadow-md transition-shadow"}`}>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100">
            {chapter.isCompleted ? <CheckCircle className="h-6 w-6 text-emerald-700" /> : locked ? <Lock className="h-6 w-6 text-slate-500" /> : <PlayCircle className="h-6 w-6 text-slate-700" />}
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg">{chapter.title}</CardTitle>
            {chapter.description && <p className="text-muted-foreground text-sm line-clamp-2">{chapter.description}</p>}
            {locked && <p className="text-sm text-red-500">Complete the previous chapter to unlock</p>}
          </div>
        </CardHeader>
      </Card>
    );

    if (locked) {
      return content;
    }

    return <Link href={`/student/courses/${course.id}/chapters/${chapter.id}`}>{content}</Link>;
  };

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div className="px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="relative aspect-video w-full md:w-[32rem] rounded-xl overflow-hidden">
            {course.imageUrl ? (
              <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <File className="h-12 w-12 text-slate-400" />
              </div>
            )}
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

            <div className="p-4 bg-slate-100 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-sm text-slate-700">Course Progress: {Math.round(progressPercentage)}%</div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                {completedChapters.length} of {course.chapters.length} chapters completed
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="space-y-4">
          {course.chapters.map((chapter, index) => (
            <div key={chapter.id}>
              <ChapterCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseChaptersPage;

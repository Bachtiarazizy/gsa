import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BookOpen, Clock, Users } from "lucide-react";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourse } from "@/lib/actions/course";
import { getEnrollmentStatus } from "@/lib/actions/enrollment";
import EnrollButton from "@/app/(dashboard)/_components/enrolled-button";
import { Metadata } from "next";
import { CompactRichTextPreview } from "@/app/(dashboard)/admin/courses/_components/preview";

export const metadata: Metadata = {
  title: "Course | Global Skills Academy",
  description: "Learn something new today",
};

function CourseDetailsSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col max-w-5xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative aspect-video w-full md:w-[50%] rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <div className="w-full md:w-[50%]">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-8 w-3/4" />
                  </CardTitle>
                  <div className="flex items-center gap-x-4 mt-2">
                    <div className="flex items-center gap-x-1">
                      <Users size={16} className="text-gray-300" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <Clock size={16} className="text-gray-300" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <Separator className="my-8" />

          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-x-2">
                    <BookOpen className="h-4 w-4 text-gray-300" />
                    <Skeleton className="h-4 w-48" />
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

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

async function CourseContent({ userId, courseId }: { userId: string; courseId: string }) {
  const [enrollmentStatus, course] = await Promise.all([
    getEnrollmentStatus(userId, courseId),
    getCourse({
      userId,
      courseId,
    }),
  ]);

  if (!course) {
    return redirect("/");
  }

  const { isEnrolled } = enrollmentStatus;

  return (
    <div className="w-full">
      <div className="flex flex-col max-w-5xl mx-auto pb-20">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative aspect-video w-full md:w-[50%] rounded-xl overflow-hidden">
              {course.imageUrl ? (
                <Image alt={course.title} src={course.imageUrl} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>

            <div className="w-full md:w-[50%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
                  <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-x-1">
                      <Users size={16} />
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-x-1">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <EnrollButton courseId={courseId} enrollmentStatus={{ isEnrolled }} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About this course</h2>
            {course.description ? <CompactRichTextPreview content={course.description} className="text-sm text-muted-foreground line-clamp-1" /> : <p className="text-sm text-muted-foreground line-clamp-2">No description available</p>}
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            {!course.chapters?.length ? (
              <p className="text-muted-foreground italic">No chapters published yet.</p>
            ) : (
              <div className="space-y-2">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const CourseIdPage = async ({ params }: CoursePageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <Suspense fallback={<CourseDetailsSkeleton />}>
      <CourseContent userId={userId} courseId={params.courseId} />
    </Suspense>
  );
};

export default CourseIdPage;

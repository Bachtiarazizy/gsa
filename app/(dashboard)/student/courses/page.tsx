import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getStudentCourses } from "@/lib/actions/course";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses | Global Skills Academy",
  description: "Continue your learning journey",
};

function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow h-full">
          <div className="relative aspect-video w-full">
            <Skeleton className="w-full h-full rounded-t-lg" />
          </div>

          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-3/4" />
            </CardTitle>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 text-gray-300" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function CoursesContent({ userId }: { userId: string }) {
  const { enrolledCourses } = await getStudentCourses(userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {enrolledCourses.map((enrollment) => (
        <Link key={enrollment.course.id} href={`/student/courses/${enrollment.course.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="relative aspect-video w-full">
              {enrollment.course.imageUrl ? (
                <div className="relative aspect-video w-full">
                  <Image src={enrollment.course.imageUrl} alt={enrollment.course.title} fill className="object-cover rounded-t-lg" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={false} />
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-200 flex items-center justify-center rounded-t-lg">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1">{enrollment.course.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {enrollment.course.duration || "Self-paced"}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>Course Progress</span>
                    <span className="text-muted-foreground">{enrollment.progress.completionPercentage}%</span>
                  </div>
                  <Progress value={enrollment.progress.completionPercentage} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-blue-500" />
                    <span>
                      {enrollment.progress.completedChapters} / {enrollment.progress.totalChapters} Chapters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>
                      {enrollment.progress.completedAssessments} / {enrollment.progress.totalAssessments} Tests
                    </span>
                  </div>
                </div>

                {enrollment.progress.lastAccessed && <div className="text-sm text-muted-foreground">Last accessed: {new Date(enrollment.progress.lastAccessed).toLocaleDateString()}</div>}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      {enrolledCourses.length === 0 && (
        <div className="col-span-full text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
          <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
          <Link href="/student/search" className="text-primary hover:underline">
            Browse Available Courses
          </Link>
        </div>
      )}
    </div>
  );
}

async function StudentCoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesContent userId={userId} />
      </Suspense>
    </div>
  );
}

export default StudentCoursesPage;

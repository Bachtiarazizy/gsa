import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Trophy, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getStudentDashboardData } from "@/lib/actions/chapter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Global Skills Academy",
  description: "Track your progress and learning journey",
};

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <BookOpen className="h-6 w-6 text-gray-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <GraduationCap className="h-6 w-6 text-gray-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="w-full h-2.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <Trophy className="h-6 w-6 text-gray-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <Clock className="h-6 w-6 text-gray-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

async function DashboardContent({ userId }: { userId: string }) {
  const { enrolledCourses, completedChapters, assessmentResults, recentActivities } = await getStudentDashboardData(userId);

  const totalCompletionRate = enrolledCourses.length > 0 ? (completedChapters.length / (enrolledCourses.length * 5)) * 100 : 0;

  const averageScore = assessmentResults.length > 0 ? assessmentResults.reduce((acc, result) => acc + result.score, 0) / assessmentResults.length : 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/student/courses" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Enrolled Courses</CardTitle>
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Completion Rate</CardTitle>
              <GraduationCap className="h-6 w-6 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{totalCompletionRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${totalCompletionRate}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Assessments</CardTitle>
              <Trophy className="h-6 w-6 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-sm text-muted-foreground">{assessmentResults.length} Tests Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent activity</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="ml-4">
                      <p className="text-sm font-medium">{activity.type === "COMPLETION" ? "Chapter Completed" : activity.type === "ASSESSMENT" ? "Assessment Completed" : "Course Enrolled"}</p>
                      <p className="text-sm text-muted-foreground">{activity.title}</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">{formatDistance(new Date(activity.createdAt), new Date(), { addSuffix: true })}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default async function StudentDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and learning journey.</p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </div>
  );
}

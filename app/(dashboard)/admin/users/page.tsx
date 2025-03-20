import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserCheck, Clock } from "lucide-react";
import { formatDistance } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma/db";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Admin Users - Dashboard",
  description: "Monitor student enrollments and engagement.",
};

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <Users className="h-6 w-6 text-gray-300" />
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

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <UserCheck className="h-6 w-6 text-gray-300" />
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
              <Skeleton className="h-4 w-36" />
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
                  <div className="ml-4 flex-1 space-y-2">
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function DashboardContent({ userId }: { userId: string }) {
  const { totalEnrollments, totalUniqueStudents, multiCourseStudents, recentEnrollments, enrollmentGrowth } = await getUsersData();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Total Enrollments</CardTitle>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{totalEnrollments}</p>
                <p className="text-sm text-muted-foreground">Course Enrollments</p>
              </div>
              {enrollmentGrowth > 0 && (
                <div className="flex items-center text-green-500">
                  <span className="text-sm font-medium">+{enrollmentGrowth}% this month</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Unique Students</CardTitle>
              <UserCheck className="h-6 w-6 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{totalUniqueStudents}</p>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Multi-Course Students</CardTitle>
              <GraduationCap className="h-6 w-6 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{multiCourseStudents}</p>
                <p className="text-sm text-muted-foreground">Enrolled in Multiple Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Enrollments</CardTitle>
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent enrollments</p>
              ) : (
                recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center">
                    <div className="ml-4">
                      <p className="text-sm font-medium">New Enrollment</p>
                      <p className="text-sm text-muted-foreground">{enrollment.course.title}</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">{formatDistance(new Date(enrollment.createdAt), new Date(), { addSuffix: true })}</div>
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

async function getUsersData() {
  try {
    // Get total enrollments
    const totalEnrollments = await prisma.courseEnrollment.count();

    // Get total unique students
    const uniqueStudents = await prisma.courseEnrollment.groupBy({
      by: ["userId"],
      _count: true,
    });

    // Get students with multiple course enrollments
    const multiCourseStudents = uniqueStudents.filter((student) => student._count > 1).length;

    // Get recent enrollments
    const recentEnrollments = await prisma.courseEnrollment.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        course: true,
      },
    });

    // Calculate growth (comparing this month to last month)
    const today = new Date();
    const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const thisMonthEnrollments = await prisma.courseEnrollment.count({
      where: {
        createdAt: {
          gte: firstDayThisMonth,
        },
      },
    });

    const lastMonthEnrollments = await prisma.courseEnrollment.count({
      where: {
        createdAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth,
        },
      },
    });

    const enrollmentGrowth = lastMonthEnrollments === 0 ? thisMonthEnrollments * 100 : (((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100).toFixed(1);

    return {
      totalEnrollments,
      totalUniqueStudents: uniqueStudents.length,
      multiCourseStudents,
      recentEnrollments,
      enrollmentGrowth: Number(enrollmentGrowth),
    };
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw error;
  }
}

export default async function AdminUsersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Monitor student enrollments and engagement.</p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </div>
  );
}

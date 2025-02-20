import React, { Suspense } from "react";
import CourseTable from "@/components/course-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCourse, getAllCourses, toggleCoursePublish } from "@/lib/actions/course";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses - Admin Dashboard",
  description: "Manage your courses and course content.",
};

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <Skeleton className="h-9 w-24" /> {/* For New Course button */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 py-3 border-b">
            <Skeleton className="h-4 w-24" /> {/* Course */}
            <Skeleton className="h-4 w-16" /> {/* Price */}
            <Skeleton className="h-4 w-20" /> {/* Status */}
            <Skeleton className="h-4 w-24" /> {/* Created */}
            <Skeleton className="h-4 w-16" /> {/* Actions */}
          </div>

          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="grid grid-cols-5 gap-4 py-4 border-b">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function CoursesContent({ userId }: { userId: string }) {
  const courses = await getAllCourses();

  return (
    <CourseTable
      courses={courses}
      onDelete={async (id) => {
        "use server";
        return deleteCourse(id);
      }}
      onTogglePublish={async (id, isPublished) => {
        "use server";
        return toggleCoursePublish(id, isPublished);
      }}
    />
  );
}

export default async function CoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your courses and course content.</p>
        </div>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <CoursesContent userId={userId} />
      </Suspense>
    </div>
  );
}

import { Metadata } from "next";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateCourseForm from "@/components/forms/course-form";
import prisma from "@/lib/prisma/db";

export const metadata: Metadata = {
  title: "Create a New Course",
  description: "Create a new course for your students",
};

function CreateFormSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" /> {/* Course Details heading */}
          <Skeleton className="h-4 w-96" /> {/* Description text */}
        </div>

        <div className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Button Group */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function getCategoriesData() {
  const categories = await prisma.category.findMany();
  return categories;
}

async function CreateCourseContent() {
  const categories = await getCategoriesData();

  return <CreateCourseForm categories={categories} />;
}

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Link href="/admin/courses">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to courses
            </Button>
          </Link>
          <div className="flex items-center gap-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Create a New Course</h1>
          </div>
          <p className="text-sm text-muted-foreground">Complete the form below to create a new course. You can edit the course details later.</p>
        </div>
      </div>
      <div className="flex-1">
        <Suspense fallback={<CreateFormSkeleton />}>
          <CreateCourseContent />
        </Suspense>
      </div>
    </div>
  );
}

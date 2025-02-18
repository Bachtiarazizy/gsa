import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditCourseForm from "@/components/forms/edit-course-form";
import { auth } from "@clerk/nextjs/server";
import { Course, Category } from "@/lib/zodSchema";
import PublishButton from "../../_components/publish-button";
import DeleteButton from "../../_components/delete-button";

export const metadata: Metadata = {
  title: "Edit Course",
  description: "Modify your existing course details",
};

interface PageProps {
  params: {
    courseId: string;
  };
}

interface TransformedCourse {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  imageUrl: string;
  attachmentUrl: string | null;
  attachmentOriginalName: string | null;
  price: number;
  categoryId: string;
  isPublished: boolean;
}

async function getCategoriesData(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

async function getCourseData(courseId: string, userId: string): Promise<Course> {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw new Error("Failed to fetch course");
  }
}

export default async function CourseEditPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  try {
    const [course, categories] = await Promise.all([getCourseData(params.courseId, userId), getCategoriesData()]);

    // Transform the course data with null coalescing to handle undefined values
    const transformedCourse: TransformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description ?? null,
      duration: course.duration ?? null,
      imageUrl: course.imageUrl ?? "",
      attachmentUrl: course.attachmentUrl ?? null,
      attachmentOriginalName: course.attachmentOriginalName ?? null,
      price: course.price,
      categoryId: course.categoryId,
      isPublished: course.isPublished,
    };

    return (
      <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
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
              <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
            </div>
            <p className="text-sm text-muted-foreground">Make changes to your course information below</p>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full space-y-4">
            <div className="w-full rounded-lg border bg-card">
              <div className="p-6">
                <EditCourseForm course={transformedCourse} categories={categories} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <PublishButton courseId={course.id} isPublished={course.isPublished} />
          <DeleteButton courseId={course.id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in CourseEditPage:", error);
    return redirect("/admin/courses");
  }
}

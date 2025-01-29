import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditCourseForm from "@/components/forms/edit-course-form";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Edit Course",
  description: "Modify your existing course details",
};

interface PageProps {
  params: {
    courseId: string;
  };
}

async function getCategoriesData() {
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

async function getCourseData(courseId: string, userId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            title: true,
            isPublished: true,
            position: true,
          },
        },
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

    // Transform the course data to match EditCourseForm's expected structure
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
      categoryId: course.categoryId,
      attachments: course.attachments.map((attachment) => ({
        url: attachment.url,
        name: attachment.name,
      })),
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

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <EditCourseForm course={transformedCourse} categories={categories} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in CourseEditPage:", error);
    return redirect("/admin/courses");
  }
}

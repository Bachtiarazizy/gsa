"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createCourseSchema } from "../zodSchema";
import { z } from "zod";
import prisma from "../db";

export async function getAllCourses() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.course.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      isPublished: true,
      enrollmentCount: true,
      price: true,
      createdAt: true,
      category: true, // Include category information
      _count: {
        select: {
          chapters: true,
          discussions: true, // Include discussions count
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteCourse(courseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, userId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // This will cascade delete all related discussions
  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath("/courses");
}

export async function createCourse(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    // Parse form data
    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      imageUrl: formData.get("imageUrl") as string,
      price: Number(formData.get("price")),
      categoryId: formData.get("categoryId") as string, // Add categoryId
      userId,
      isPublished: false,
    };

    // Validate data using the imported schema
    const validatedData = createCourseSchema.parse(courseData);

    // Create course in database
    const course = await prisma.course.create({
      data: validatedData,
    });

    revalidatePath("/courses");

    return {
      success: true,
      data: {
        id: course.id,
      },
    };
  } catch (error) {
    console.error("Course creation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      error: "Failed to create course",
    };
  }
}

export async function getDashboardData() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const totalCourses = await prisma.course.count({
      where: {
        userId: userId,
        isPublished: true,
      },
    });

    const totalStudents = await prisma.courseEnrollment.count({
      where: {
        course: {
          userId: userId,
        },
      },
    });

    // Include discussions in recent activities
    const recentActivities = await prisma.course.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        enrollments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        discussions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        category: true,
      },
    });

    const courses = await prisma.course.findMany({
      where: {
        userId: userId,
      },
      include: {
        enrollments: true,
      },
    });

    const totalRevenue = courses.reduce((acc, course) => {
      return acc + course.price * course.enrollmentCount;
    }, 0);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const coursesLastMonth = await prisma.course.count({
      where: {
        userId: userId,
        isPublished: true,
        createdAt: {
          gte: lastMonth,
        },
      },
    });

    const studentsLastMonth = await prisma.courseEnrollment.count({
      where: {
        course: {
          userId: userId,
        },
        createdAt: {
          gte: lastMonth,
        },
      },
    });

    const courseGrowth = totalCourses > 0 ? (coursesLastMonth / totalCourses) * 100 : 0;
    const studentGrowth = totalStudents > 0 ? (studentsLastMonth / totalStudents) * 100 : 0;

    // Get total discussions count
    const totalDiscussions = await prisma.discussion.count({
      where: {
        course: {
          userId: userId,
        },
      },
    });

    return {
      totalCourses,
      totalStudents,
      totalRevenue,
      totalDiscussions,
      recentActivities,
      growth: {
        courses: courseGrowth.toFixed(1),
        students: studentGrowth.toFixed(1),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// New function to get categories
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

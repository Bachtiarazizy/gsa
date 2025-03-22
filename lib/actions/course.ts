"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createCourseSchema } from "../zod-schema/zodSchema";
import { z } from "zod";
import prisma from "../prisma/db";

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
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    return { error: "Something went wrong" };
  }
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    if (isPublished) {
      const requiredFields = [course.title, course.description, course.imageUrl, course.categoryId, course.chapters.some((chapter) => chapter.isPublished)];

      if (!requiredFields.every(Boolean)) {
        return { error: "Missing required fields" };
      }
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("[COURSE_TOGGLE_PUBLISH]", error);
    return { error: "Something went wrong" };
  }
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

export async function getStudentCourses(userId: string) {
  const enrolledCourses = await prisma.courseEnrollment.findMany({
    where: {
      userId: userId,
      role: "STUDENT",
    },
    include: {
      course: {
        include: {
          chapters: {
            include: {
              assessment: true,
            },
          },
        },
      },
    },
  });

  // Get progress for each course
  const coursesWithProgress = await Promise.all(
    enrolledCourses.map(async (enrollment) => {
      const completedChapters = await prisma.chapterProgress.count({
        where: {
          userId: userId,
          chapter: {
            courseId: enrollment.courseId,
          },
          isCompleted: true,
        },
      });

      const completedAssessments = await prisma.assessmentResult.count({
        where: {
          userId: userId,
          assessment: {
            chapter: {
              courseId: enrollment.courseId,
            },
          },
          isPassed: true,
        },
      });

      // Get last accessed chapter
      const lastProgress = await prisma.chapterProgress.findFirst({
        where: {
          userId: userId,
          chapter: {
            courseId: enrollment.courseId,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const totalChapters = enrollment.course.chapters.length;
      const totalAssessments = enrollment.course.chapters.reduce((acc, chapter) => acc + (chapter.assessment ? 1 : 0), 0);

      const progress = {
        completedChapters,
        totalChapters,
        completedAssessments,
        totalAssessments,
        completionPercentage: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
        lastAccessed: lastProgress?.updatedAt,
      };

      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        role: enrollment.role,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
        course: enrollment.course,
        progress,
      };
    })
  );

  return {
    enrolledCourses: coursesWithProgress,
  };
}

interface GetCoursesParams {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({ title, categoryId }: GetCoursesParams) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      imageUrl: course.imageUrl,
      description: course.description,
      enrollmentCount: course.enrollmentCount,
      price: course.price,
      category: course.category.name, // Map category object to category name string
    }));
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return [];
  }
};

interface GetCoursesParam {
  title?: string;
  categoryId?: string;
}
export const getCoursePage = async ({ title, categoryId }: GetCoursesParam) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      imageUrl: course.imageUrl,
      description: course.description,
      enrollmentCount: course.enrollmentCount,
      price: course.price,
      category: course.category.name, // Map category object to category name string
    }));
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return [];
  }
};

interface GetCourseProps {
  userId: string;
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCourse = async ({ userId, courseId }: GetCourseProps) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  } catch (error) {
    console.log("[GET_COURSE]", error);
    return null;
  }
};

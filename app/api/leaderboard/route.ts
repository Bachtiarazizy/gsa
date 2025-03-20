// app/api/leaderboard/route.ts
import prisma from "@/lib/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all student profiles
    const students = await prisma.studentProfile.findMany({
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        university: true,
        enrollments: {
          select: {
            courseId: true,
            course: {
              select: {
                chapters: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get points data for each student
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        // Count completed chapters
        const completedChapters = await prisma.chapterProgress.count({
          where: {
            userId: student.userId,
            isCompleted: true,
          },
        });

        // Count passed assessments
        const passedAssessments = await prisma.assessmentResult.count({
          where: {
            userId: student.userId,
            isPassed: true,
          },
        });

        // Count course enrollments
        const enrolledCourses = student.enrollments.length;

        // Calculate total points
        const points =
          completedChapters * 10 + // 10 points per completed chapter
          passedAssessments * 50 + // 50 points per passed assessment
          enrolledCourses * 5; // 5 points per course enrollment

        return {
          id: student.id,
          userId: student.userId,
          firstName: student.firstName,
          lastName: student.lastName,
          points: points,
        };
      })
    );

    // Sort by points in descending order
    const sortedLeaderboard = leaderboardData.sort((a, b) => b.points - a.points);

    return NextResponse.json(sortedLeaderboard);
  } catch (error) {
    console.error("[LEADERBOARD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

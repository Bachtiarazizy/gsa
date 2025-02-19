// app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all student profiles with their progress
    const leaderboard = await prisma.studentProfile.findMany({
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        university: true,
        enrollments: {
          select: {
            course: {
              select: {
                chapters: {
                  select: {
                    id: true,
                    progress: {
                      where: {
                        userId,
                      },
                      select: {
                        isCompleted: true,
                      },
                    },
                    assessment: {
                      select: {
                        results: {
                          where: {
                            userId,
                          },
                          select: {
                            score: true,
                            isPassed: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate statistics for each student
    const leaderboardEntries = leaderboard.map((student) => {
      let completedCourses = 0;
      let completedChapters = 0;
      let assessmentsPassed = 0;
      let totalScore = 0;

      student.enrollments.forEach((enrollment) => {
        const chapters = enrollment.course.chapters;
        let courseCompleted = true;

        chapters.forEach((chapter) => {
          // Check chapter completion
          if (chapter.progress.some((p) => p.isCompleted)) {
            completedChapters++;
          } else {
            courseCompleted = false;
          }

          // Check assessment results
          if (chapter.assessment?.results && chapter.assessment.results.length > 0) {
            const bestResult = chapter.assessment.results.reduce((best, current) => (current.score > best.score ? current : best));

            if (bestResult.isPassed) {
              assessmentsPassed++;
              totalScore += bestResult.score;
            }
          }
        });

        if (courseCompleted) {
          completedCourses++;
        }
      });

      return {
        id: student.id,
        userId: student.userId,
        firstName: student.firstName,
        lastName: student.lastName,
        university: student.university,
        completedCourses,
        completedChapters,
        assessmentsPassed,
        totalScore,
      };
    });

    // Sort by total score and then by completed courses
    const sortedLeaderboard = leaderboardEntries.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.completedCourses !== a.completedCourses) return b.completedCourses - a.completedCourses;
      return b.completedChapters - a.completedChapters;
    });

    return NextResponse.json(sortedLeaderboard);
  } catch (error) {
    console.error("[LEADERBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

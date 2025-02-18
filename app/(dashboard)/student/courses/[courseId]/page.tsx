import { redirect } from "next/navigation";
import { BookOpen, Clock, Users } from "lucide-react";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCourse } from "@/lib/actions/course";
import { getEnrollmentStatus } from "@/lib/actions/enrollment";
import EnrollButton from "@/components/enrolled-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course | Global Skills Academy",
  description: "Learn something new today",
};

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params }: CoursePageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const [enrollmentStatus, course] = await Promise.all([
    getEnrollmentStatus(userId, params.courseId),
    getCourse({
      userId,
      courseId: params.courseId,
    }),
  ]);

  if (!course) {
    return redirect("/");
  }

  const { isEnrolled } = enrollmentStatus;

  return (
    <div className="w-full">
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative aspect-video w-full md:w-[50%] rounded-xl overflow-hidden">
              {course.imageUrl ? (
                <Image alt={course.title} src={course.imageUrl} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>

            <div className="w-full md:w-[50%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
                  <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-x-1">
                      <Users size={16} />
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-x-1">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <EnrollButton courseId={params.courseId} enrollmentStatus={{ isEnrolled }} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About this course</h2>
            <p className="text-muted-foreground">{course.description || "No description available."}</p>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            {!course.chapters?.length ? (
              <p className="text-muted-foreground italic">No chapters published yet.</p>
            ) : (
              <div className="space-y-2">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;

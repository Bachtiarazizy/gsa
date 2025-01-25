import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileEdit, GraduationCap, Users, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/courses");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-x-2">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-sm text-muted-foreground">{course.isPublished ? "Published" : "Draft"}</p>
          </div>
        </div>
        <Link href={`/courses/${params.courseId}/edit`}>
          <Button className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Edit Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Overview of your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{course.description || "No description provided"}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <h3 className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </h3>
                <p className="text-sm text-muted-foreground">{course.duration || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Enrollment
                </h3>
                <p className="text-sm text-muted-foreground">{course.enrollmentCount || 0} students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Stats</CardTitle>
            <CardDescription>Quick overview of your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Total Chapters</h3>
                <p className="text-2xl font-bold">{course._count.chapters}</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Published Chapters</h3>
                <p className="text-2xl font-bold">{course.chapters.filter((chapter) => chapter.isPublished).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chapters</CardTitle>
              <CardDescription>Manage your course chapters</CardDescription>
            </div>
            <Link href={`/courses/${params.courseId}/chapters/create`}>
              <Button>Add Chapter</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {course.chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <BookOpen className="h-10 w-10 mb-2" />
                <p>No chapters created yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {course.chapters.map((chapter) => (
                  <Link key={chapter.id} href={`/courses/${params.courseId}/chapters/${chapter.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200">{chapter.position}</div>
                      <div>
                        <p className="font-medium">{chapter.title}</p>
                        {chapter.description && <p className="text-sm text-muted-foreground line-clamp-1">{chapter.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={chapter.isPublished ? "default" : "secondary"}>{chapter.isPublished ? "Published" : "Draft"}</Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

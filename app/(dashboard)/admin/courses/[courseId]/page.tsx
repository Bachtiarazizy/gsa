import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileEdit, GraduationCap, Users, Clock, ChevronRight, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { CompactRichTextPreview } from "../_components/preview";

export const metadata: Metadata = {
  title: "Course Details - Admin Dashboard",
  description: "Manage your course content and discussions.",
};

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
      category: true,
      discussions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          _count: {
            select: {
              replies: true,
              likes: true,
            },
          },
        },
      },
      _count: {
        select: {
          chapters: true,
          discussions: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-x-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <h1 className="text-base sm:text-2xl font-bold">{course.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {course.category.name}
              </Badge>
              <p className="text-sm text-muted-foreground">{course.isPublished ? "Published" : "Draft"}</p>
            </div>
          </div>
        </div>
        <Link href={`/admin/courses/${params.courseId}/edit`}>
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
              {course.description ? <CompactRichTextPreview content={course.description} className="text-sm text-muted-foreground" /> : <p className="text-sm text-muted-foreground line-clamp-2">No description available</p>}
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
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Total Chapters</h3>
                <p className="text-2xl  font-bold">{course._count.chapters}</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Published</h3>
                <p className="text-2xl font-bold">{course.chapters.filter((chapter) => chapter.isPublished).length}</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Discussions</h3>
                <p className="text-2xl font-bold">{course._count.discussions}</p>
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
            <Link href={`/admin/courses/${params.courseId}/chapters/create`}>
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
                  <Link key={chapter.id} href={`/admin/courses/${params.courseId}/chapters/${chapter.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200">{chapter.position}</div>
                      <div>
                        <p className="font-medium">{chapter.title}</p>
                        {chapter.description ? (
                          <CompactRichTextPreview content={chapter.description} className="text-sm text-muted-foreground line-clamp-1" />
                        ) : (
                          <p className="text-sm text-muted-foreground line-clamp-2">No description available</p>
                        )}
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

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Discussions</CardTitle>
              <CardDescription>Latest conversations in your course</CardDescription>
            </div>
            <Link href={`/admin/courses/${params.courseId}/discussions`}>
              <Button variant="outline">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {course.discussions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <MessageCircle className="h-10 w-10 mb-2" />
                <p>No discussions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.discussions.map((discussion) => (
                  <div key={discussion.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium line-clamp-2">{discussion.content}</p>
                      <Badge variant="outline" className="ml-2">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{discussion._count.replies} replies</span>
                      <span>{discussion._count.likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

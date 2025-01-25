"use client";

import React from "react";
import { FileEdit, Eye, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteCourse, toggleCoursePublish } from "@/lib/actions/course";

interface Course {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  enrollmentCount: number;
  price: number;
  createdAt: Date;
  _count: {
    chapters: number;
  };
}

interface AdminCoursesPageProps {
  courses: Course[];
}

export default function AdminCoursesPage({ courses }: AdminCoursesPageProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast({
        title: "Course Deleted",
        description: "The course has been successfully removed.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the course.",
        variant: "destructive",
      });
    }
  };

  const handlePublishToggle = async (courseId: string, currentStatus: boolean) => {
    try {
      await toggleCoursePublish(courseId, !currentStatus);
      toast({
        title: "Course Status Updated",
        description: `Course is now ${currentStatus ? "draft" : "published"}.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Button onClick={() => router.push("/courses/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-muted-foreground">No courses found. Start by creating a new course.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Chapters</TableHead>
              <TableHead className="text-center">Enrollments</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="font-medium">{course.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(course.createdAt).toLocaleDateString()}</div>
                </TableCell>
                <TableCell className="text-center">{course._count.chapters}</TableCell>
                <TableCell className="text-center">{course.enrollmentCount}</TableCell>
                <TableCell className="text-center">{course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={course.isPublished ? "default" : "destructive"} className="cursor-pointer" onClick={() => handlePublishToggle(course.id, course.isPublished)}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/courses/${course.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => router.push(`/courses/${course.id}/edit`)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete the course and all its associated data.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(course.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

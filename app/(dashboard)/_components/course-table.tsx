"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  isPublished: boolean;
  enrollmentCount: number;
  price: number;
  createdAt: Date;
  category: {
    id: string;
    name: string;
  };
  _count: {
    chapters: number;
  };
}

interface CourseTableProps {
  courses: Course[];
  onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
  onTogglePublish: (id: string, isPublished: boolean) => Promise<{ success?: boolean; error?: string }>;
}

const CourseTable = ({ courses, onDelete, onTogglePublish }: CourseTableProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(id);
      const response = await onDelete(id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Course deleted successfully");
        router.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      setIsLoading(id);
      const response = await onTogglePublish(id, !currentStatus);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(`Course ${currentStatus ? "unpublished" : "published"} successfully`);
        router.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Courses Overview</CardTitle>
        <Link href="/admin/courses/create">
          <Button>Create Course</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No courses found
            <Link href="/admin/courses/create">
              <Button className="ml-2">Create a course</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Details</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">Chapters</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(course.createdAt).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{course.category.name}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{course._count.chapters}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{course.enrollmentCount}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={course.isPublished ? "default" : "secondary"}>{course.isPublished ? "Published" : "Draft"}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger disabled={isLoading === course.id}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}/edit`)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublish(course.id, course.isPublished)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {course.isPublished ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(course.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseTable;

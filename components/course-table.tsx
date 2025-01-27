import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

const CourseTable = ({ courses }: CourseTableProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Courses Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No courses found</div>
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

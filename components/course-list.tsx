import React from "react";
import CourseCard from "./course-card";

interface Course {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
  enrollmentCount: number;
  price: number;
  category: string;
}

interface CourseListProps {
  courses: Course[];
}

const CourseList = ({ courses }: CourseListProps) => {
  if (!courses.length) {
    return (
      <div className="text-center mt-10">
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
};

export default CourseList;

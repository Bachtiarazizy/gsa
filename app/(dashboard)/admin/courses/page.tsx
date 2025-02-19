// app/admin/courses/page.tsx
import CourseTable from "@/components/course-table";
import { deleteCourse, getAllCourses, toggleCoursePublish } from "@/lib/actions/course";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses - Admin Dashboard",
  description: "Manage your courses and course content.",
};

export default async function CoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const courses = await getAllCourses();

  return (
    <div className="p-6">
      <CourseTable
        courses={courses}
        onDelete={async (id) => {
          "use server";
          return deleteCourse(id);
        }}
        onTogglePublish={async (id, isPublished) => {
          "use server";
          return toggleCoursePublish(id, isPublished);
        }}
      />
    </div>
  );
}

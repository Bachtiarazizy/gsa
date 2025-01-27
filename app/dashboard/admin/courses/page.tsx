import CourseTable from "@/components/course-table";
import { getAllCourses } from "@/lib/actions/course";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const courses = await getAllCourses();

  return <CourseTable courses={courses} />;
}

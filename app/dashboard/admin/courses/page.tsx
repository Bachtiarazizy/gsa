import AdminCoursesPage from "@/components/course";
import { getAllCourses } from "@/lib/actions/course";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const courses = await getAllCourses();

  return <AdminCoursesPage courses={courses} />;
}

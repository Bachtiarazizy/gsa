import Categories from "@/components/categories";
import CourseList from "@/components/course-list";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/lib/actions/course";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    title: searchParams.title,
    categoryId: searchParams.categoryId,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <Categories items={categories} />
      <div className="px-6 overflow-y-auto bg-secondary mx-0 md:mx-auto py-6 rounded-none md:h-[calc(100vh-170px)] md:rounded-none md:rounded-bl-3xl md:mt-1 md:rounded-tl-xl container">
        <CourseList courses={courses} />
      </div>
    </div>
  );
};

export default SearchPage;

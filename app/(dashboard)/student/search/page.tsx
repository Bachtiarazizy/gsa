import Categories from "@/components/categories";
import CourseList from "@/components/course-list";
import { getCourses } from "@/lib/actions/course";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
// import ClientSearchInput from "../_components/client-search";

interface SearchResultsProps {
  userId: string;
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}

interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}

const SearchResults = async ({ userId, searchParams }: SearchResultsProps) => {
  const courses = await getCourses({
    userId,
    title: searchParams.title,
    categoryId: searchParams.categoryId,
  });

  return <CourseList courses={courses} />;
};

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

  return (
    <Suspense>
      <div>
        {/* <ClientSearchInput /> */}
        <Categories items={categories} />
        <div className="px-6 overflow-y-scroll bg-secondary mx-0 md:mx-auto py-6 rounded-none md:h-[calc(100vh-170px)] md:rounded-none md:rounded-bl-3xl md:mt-1 md:rounded-tl-xl container">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            }
          >
            <SearchResults userId={userId} searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
};

export default SearchPage;

import Categories from "@/app/(dashboard)/_components/categories";
import CourseList from "@/app/(dashboard)/_components/course-list";
import SearchInput from "@/app/(dashboard)/_components/search-input";
import { getCourses } from "@/lib/actions/course";
import prisma from "@/lib/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search Courses | Global Skills Academy",
  description: "Search for courses",
};

interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}
const CategorySkeleton = () => (
  <div className="flex gap-x-2 p-2">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-8 w-24 rounded-full" />
    ))}
  </div>
);

const CourseCardSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 border rounded-lg">
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex items-center gap-2 mt-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const SearchPageSkeleton = () => (
  <div className="space-y-6">
    <div className="md:hidden md:mb-0 block">
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
    <div className="bg-primary-secondary md:rounded-tl-3xl md:rounded-bl-xl">
      <CategorySkeleton />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[...Array(6)].map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-6">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchContent userId={userId} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const SearchContent = async ({ userId, searchParams }: { userId: string; searchParams: { title?: string; categoryId?: string } }) => {
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
    <>
      <div className="md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="bg-primary-secondary md:rounded-tl-3xl md:rounded-bl-xl container mx-auto">
        <Categories items={categories} />
      </div>
      <div className="overflow-y-auto bg-primary-secondary mx-0 md:mx-auto rounded-none md:h-[calc(100vh-170px)] md:rounded-none md:rounded-bl-3xl md:mt-1 md:rounded-tl-xl container">
        <CourseList courses={courses} />
      </div>
    </>
  );
};

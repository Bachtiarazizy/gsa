/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";
import { getCourses } from "@/lib/actions/course";
import prisma from "@/lib/db";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CoursePageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}

// Loading skeletons
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

const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-24 lg:py-32">
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
    <div className="py-16 lg:py-24">
      <Skeleton className="h-12 w-1/3 mx-auto mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default async function CoursePage({ searchParams }: CoursePageProps) {
  return (
    <div className="bg-white">
      <Suspense fallback={<PageSkeleton />}></Suspense>
    </div>
  );
}

const CoursePageContent = async ({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}) => {
  // Fetch categories and courses from the database
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

  // Featured courses (could be filtered from all courses based on some criteria)
  const featuredCourses = courses.slice(0, 3);

  // Student testimonials (could come from a database)
  const studentTestimonials = [
    {
      id: 1,
      name: "James Wilson",
      role: "Frontend Developer",
      comment: "The Web Development Fundamentals course completely transformed my career. The hands-on approach and expert guidance helped me land my first dev job.",
      image: "/api/placeholder/64/64",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      role: "Software Engineer",
      comment: "After completing the Advanced React course, I was able to contribute to my team's projects immediately. The real-world examples were incredibly valuable.",
      image: "/api/placeholder/64/64",
    },
    {
      id: 3,
      name: "David Kim",
      role: "Full-Stack Developer",
      comment: "The MERN stack course was comprehensive and challenging in the best way. I'm now building my own web applications with confidence.",
      image: "/api/placeholder/64/64",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-24 lg:py-32">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Discover Our{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Courses</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-blue-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">Elevate your skills with our expert-led, hands-on technology courses.</p>

            <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <a
                href="#courses"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-green-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-green-700"
              >
                Browse Courses
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 transition-all hover:border-gray-400">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-primary-secondary py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`?categoryId=${category.id}`}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors
                  ${searchParams.categoryId === category.id ? "bg-blue-600 text-white" : "bg-white/20 text-gray-800 hover:bg-white/30"}`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}

      {/* Course Categories Section */}

      {/* Testimonials Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-16 lg:py-24">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Student Success Stories</h2>
            <p className="mt-4 text-lg text-gray-600">Hear from our graduates about their learning experience.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {studentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="group relative rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6">
                    {/* 5 stars */}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="mb-6 italic text-gray-600">&quot;{testimonial.comment}&ldquo;</p>

                  <div className="flex items-center">
                    <Image src={testimonial.image} alt={testimonial.name} width={64} height={64} className="h-10 w-10 rounded-full object-cover" />
                    <div className="ml-3">
                      <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 px-6 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-xl text-center text-white">
              <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
              <p className="mt-4 text-lg">Join thousands of students who have transformed their careers with our courses.</p>

              <div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <a href="/search" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-lg transition-all hover:bg-gray-100">
                  Browse All Courses
                </a>
                <a href="#" className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-medium text-white transition-all hover:bg-white/10">
                  Get Free Trial
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Courses = () => {
  return (
    <section id="courses-section">
      <div className="bg-gradient-to-b from-slate-50 to-white px-6 py-20 sm:px-8 lg:px-24 xl:py-32">
        {/* Section Header */}
        <div className="mx-auto mb-16 text-center md:mb-20 lg:max-w-3xl">
          <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Empowering Learners
            <span className="relative mx-2 block">
              <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">With Expert-Led Courses</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-600 lg:text-xl">Comprehensive learning pathways designed to help you master the skills needed in today&apos;s digital world</p>
        </div>

        {/* Courses Grid */}
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Course Item 1 */}
          <li className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-x-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110">
                  <Image src="/api/placeholder/50/50" alt="Interactive Learning" width={32} height={32} className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-gray-900">Interactive Learning</h3>
              </div>
              <p className="mb-6 text-lg text-gray-600">Real-time progress tracking and personalized feedback to enhance your learning experience.</p>
              <Link href="/course-details" className="group/link inline-flex items-center gap-2 text-green-600 transition-colors duration-300 hover:text-green-700">
                Learn more
                <svg className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </li>

          {/* Course Item 2 */}
          <li className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-x-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 transition-transform duration-300 group-hover:scale-110">
                  <Image src="/api/placeholder/50/50" alt="Certification Paths" width={32} height={32} className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-gray-900">Industry Certifications</h3>
              </div>
              <p className="mb-6 text-lg text-gray-600">Earn recognized certifications and badges to showcase your expertise and skills.</p>
              <Link href="/course-details" className="group/link inline-flex items-center gap-2 text-blue-600 transition-colors duration-300 hover:text-blue-700">
                Learn more
                <svg className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </li>

          {/* Course Item 3 */}
          <li className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-x-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 transition-transform duration-300 group-hover:scale-110">
                  <Image src="/api/placeholder/50/50" alt="Expert Access" width={32} height={32} className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-gray-900">Expert-Led Content</h3>
              </div>
              <p className="mb-6 text-lg text-gray-600">24/7 access to comprehensive course materials created by industry experts.</p>
              <Link href="/course-details" className="group/link inline-flex items-center gap-2 text-indigo-600 transition-colors duration-300 hover:text-indigo-700">
                Learn more
                <svg className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Courses;

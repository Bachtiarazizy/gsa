import Image from "next/image";
import Link from "next/link";
import React from "react";

const Testimonials = () => {
  return (
    <section id="testimonial-section">
      <div className="bg-gradient-to-b from-slate-50 to-white pb-20 xl:pb-[150px] px-6 sm:px-8 lg:px-24">
        <div className="">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-8 md:mb-16 lg:mb-20">
            <div className="jos max-w-[480px] lg:max-w-2xl xl:max-w-[840px]">
              <h2 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-[44px] lg:text-[56px] xl:text-[70px]">
                Success Stories from
                <span className="relative mx-2 block">
                  <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Our Students</span>
                  <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h2>
            </div>
            <Link href="/testimonials" className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-green-700">
              Read More Stories
            </Link>
          </div>
        </div>

        <div className="horizontal-slide-from-right-to-left grid w-[200%] grid-flow-col gap-6">
          {/* Testimonial 1 */}
          <div className="flex w-[415px] flex-col gap-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700">&quot;Global Skills Academy helped me land my dream job in tech. The practical projects and industry-focused curriculum made all the difference!&quot;</p>
            <div className="flex items-center gap-x-4">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                <Image src="/api/placeholder/60/60" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="block text-lg font-semibold text-gray-900">Putri Wijaya</span>
                <span className="block text-sm text-gray-600">Software Developer, Jakarta</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="flex w-[415px] flex-col gap-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700">&quot;The bilingual support and flexible schedule allowed me to study while working. The mentorship program was incredibly helpful!&quot;</p>
            <div className="flex items-center gap-x-4">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                <Image src="/api/placeholder/60/60" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="block text-lg font-semibold text-gray-900">Budi Santoso</span>
                <span className="block text-sm text-gray-600">Data Analyst, Surabaya</span>
              </div>
            </div>
          </div>
          <div className="flex w-[415px] flex-col gap-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700">&quot;The bilingual support and flexible schedule allowed me to study while working. The mentorship program was incredibly helpful!&quot;</p>
            <div className="flex items-center gap-x-4">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                <Image src="/api/placeholder/60/60" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="block text-lg font-semibold text-gray-900">Budi Santoso</span>
                <span className="block text-sm text-gray-600">Data Analyst, Surabaya</span>
              </div>
            </div>
          </div>
          <div className="flex w-[415px] flex-col gap-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700">&quot;The bilingual support and flexible schedule allowed me to study while working. The mentorship program was incredibly helpful!&quot;</p>
            <div className="flex items-center gap-x-4">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                <Image src="/api/placeholder/60/60" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="block text-lg font-semibold text-gray-900">Budi Santoso</span>
                <span className="block text-sm text-gray-600">Data Analyst, Surabaya</span>
              </div>
            </div>
          </div>
          <div className="flex w-[415px] flex-col gap-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700">&quot;The bilingual support and flexible schedule allowed me to study while working. The mentorship program was incredibly helpful!&quot;</p>
            <div className="flex items-center gap-x-4">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                <Image src="/api/placeholder/60/60" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="block text-lg font-semibold text-gray-900">Budi Santoso</span>
                <span className="block text-sm text-gray-600">Data Analyst, Surabaya</span>
              </div>
            </div>
          </div>
          <div className="flex w-[415px] flex-col gap-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700">&quot;The bilingual support and flexible schedule allowed me to study while working. The mentorship program was incredibly helpful!&quot;</p>
            <div className="flex items-center gap-x-4">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                <Image src="/api/placeholder/60/60" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="block text-lg font-semibold text-gray-900">Budi Santoso</span>
                <span className="block text-sm text-gray-600">Data Analyst, Surabaya</span>
              </div>
            </div>
          </div>

          {/* Additional testimonials follow the same pattern... */}
          {/* Note: The actual component would include all testimonials, this is truncated for brevity */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

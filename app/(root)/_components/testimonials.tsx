import Image from "next/image";
import Link from "next/link";
import React from "react";

const Testimonials = () => {
  // Testimonial data defined at the top
  const testimonials = [
    {
      id: 1,
      content: "Global Skills Academy helped me land my dream job in tech. The practical projects and industry-focused curriculum made all the difference!",
      name: "Putri Wijaya",
      role: "Software Developer, Jakarta",
      stars: 5,
      bgClass: "bg-secondary",
    },
    {
      id: 2,
      content: "The instructors were incredibly knowledgeable and supportive. I went from beginner to confident professional in just 6 months!",
      name: "Siti Nurmala",
      role: "UX Designer, Bandung",
      stars: 5,
      bgClass: "bg-white dark:bg-slate-800",
    },
    {
      id: 3,
      content: "The flexible learning schedule allowed me to balance my full-time job while acquiring new skills. Worth every penny!",
      name: "Budi Santoso",
      role: "Data Analyst, Surabaya",
      stars: 5,
      bgClass: "bg-secondary",
    },
    {
      id: 4,
      content: "The career support services were exceptional. They helped me polish my resume and prepare for interviews with top companies.",
      name: "Dewi Lestari",
      role: "Product Manager, Yogyakarta",
      stars: 5,
      bgClass: "bg-white dark:bg-slate-800",
    },
    // Duplicate the first few testimonials to create a seamless loop
    {
      id: 5,
      content: "Global Skills Academy helped me land my dream job in tech. The practical projects and industry-focused curriculum made all the difference!",
      name: "Putri Wijaya",
      role: "Software Developer, Jakarta",
      stars: 5,
      bgClass: "bg-secondary",
    },
    {
      id: 6,
      content: "The instructors were incredibly knowledgeable and supportive. I went from beginner to confident professional in just 6 months!",
      name: "Siti Nurmala",
      role: "UX Designer, Bandung",
      stars: 5,
      bgClass: "bg-white dark:bg-slate-800",
    },
  ];

  return (
    <section id="testimonial-section">
      <div className="bg-background pb-20 xl:pb-[150px] px-6 sm:px-8 lg:px-24">
        <div className="">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-8 md:mb-16 lg:mb-20">
            <div className="jos max-w-[480px] lg:max-w-2xl xl:max-w-[840px]">
              <h2 className="font-heading text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-[44px] lg:text-[56px] xl:text-[70px]">
                Success Stories from
                <span className="relative mx-2 block">
                  <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Our Students</span>
                  <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h2>
            </div>
            <Link href="/testimonials" className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
              Read More Stories
            </Link>
          </div>
        </div>

        {/* Use the marquee animation class */}
        <div className="overflow-hidden">
          <div className="animate-marquee flex gap-6">
            {/* Render testimonials from data */}
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`group relative flex-shrink-0 w-[415px] flex flex-col gap-y-8 rounded-xl ${testimonial.bgClass} p-8 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden ${
                  testimonial.bgClass === "bg-white dark:bg-slate-800" ? "dark:shadow-slate-700" : ""
                }`}
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="relative z-10 text-lg text-gray-700 dark:text-gray-300">&quot;{testimonial.content}&quot;</p>

                <div className="relative z-10 flex items-center gap-x-4">
                  <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                    <Image src="/image/2.jpg" alt="Student" width={60} height={60} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="block text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</span>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

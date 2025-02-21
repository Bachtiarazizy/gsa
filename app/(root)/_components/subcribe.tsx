import Link from "next/link";
import React from "react";

const Subscribe = () => {
  return (
    <section className="px-6 py-12 sm:px-8 lg:px-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-16 sm:px-12 md:py-20 xl:py-24">
        <div className="relative z-10">
          {/* Section Content Block */}
          <div className="mx-auto max-w-[500px] text-center lg:max-w-2xl xl:max-w-[840px]">
            <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Start Your Learning Journey Today</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">Join thousands of Indonesian students achieving their career goals through our industry-recognized courses</p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:mt-10">
            <Link href="/get-started" className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-green-600 shadow-sm transition-colors hover:bg-gray-50">
              Mulai Belajar Sekarang
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-green-600">
              Lihat Semua Kursus
            </Link>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        <div className="absolute left-0 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
      </div>
    </section>
  );
};

export default Subscribe;

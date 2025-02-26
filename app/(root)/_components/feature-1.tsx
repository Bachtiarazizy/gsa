import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FeatureOne = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Container */}
          <div className="group relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="relative aspect-[4/3] w-full">
                <Image src="/img/feature-1.jpg" alt="Expert-led training illustration" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 -z-10 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 -z-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
          </div>

          {/* Content Container */}
          <div className="order-1 space-y-8 lg:order-2">
            <div>
              <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Transform Your Career
                <span className="relative mx-2 block">
                  <span className="relative z-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">With Expert-Led Training</span>
                  <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 lg:text-xl">
                  Global Skills Academy empowers learners worldwide with industry-relevant courses designed by leading experts. Our comprehensive learning platform combines theoretical knowledge with practical skills development.
                </p>
                <p className="text-lg text-gray-600 lg:text-xl">
                  Whether you&apos;re starting your journey or advancing your career, our interactive platform provides personalized learning paths, real-world projects, and professional certifications to help you achieve your goals.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="https://www.example.com"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Explore Our Courses
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureOne;

import Image from "next/image";
import Link from "next/link";
import React from "react";

const FeatureOne = () => {
  return (
    <section id="section-content-1">
      {/* Section Spacer */}
      <div className="py-20 xl:py-[130px] w-full px-6 sm:px-8 lg:px-24">
        {/* Section Container */}
        <div className="">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,_1fr)_1.3fr] lg:gap-[60px] xl:gap-x-[94px]">
            <div className="jos" data-jos_animation="fade-left">
              <div className="overflow-hidden rounded-[10px]">
                <Image src="/assets/img_placeholder/th-4/content-img-1.jpg" alt="content-img-2" width={550} height={550} className="h-auto w-full" />
              </div>
            </div>
            <div className="jos" data-jos_animation="fade-right">
              {/* Section Content Block */}
              <div className="mb-6">
                <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Transform Your Career with Expert-Led Training</h2>{" "}
              </div>
              {/* Section Content Block */}
              <div>
                <p className="mb-8 text-lg leading-[1.42] last:mb-0 lg:text-[21px]">
                  Global Skills Academy empowers learners worldwide with industry-relevant courses designed by leading experts. Our comprehensive learning platform combines theoretical knowledge with practical skills development.
                </p>
                <p className="mb-8 text-lg leading-[1.42] last:mb-0 lg:text-[21px]">
                  Whether you&apos;re starting your journey or advancing your career, our interactive platform provides personalized learning paths, real-world projects, and professional certifications to help you achieve your goals.
                </p>
                <Link rel="noopener noreferrer" href="https://www.example.com" className="button inline-block h-full rounded border-none bg-[#1A1AFF] py-3 text-base text-black after:border-none after:bg-white">
                  Explore Our Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Section Container */}
      </div>
      {/* Section Spacer */}
    </section>
  );
};

export default FeatureOne;

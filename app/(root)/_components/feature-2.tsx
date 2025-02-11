import Image from "next/image";
import React from "react";

const FeatureTwo = () => {
  return (
    <section id="section-content-2">
      {/* Section Spacer */}
      <div className="py-20 xl:py-[130px] w-full px-6 sm:px-8 lg:px-24">
        {/* Section Container */}
        <div className="">
          <div className="grid items-center gap-10 md:grid-cols-[1.1fr_minmax(0,_1fr)] lg:gap-[60px] xl:gap-x-[110px]">
            <div className="jos order-2" data-jos_animation="fade-left">
              <div className="overflow-hidden rounded-[10px]">
                <Image src="/assets/img_placeholder/th-4/content-img-2.jpg" alt="content-img-2" width={550} height={550} className="h-auto w-full" />
              </div>
            </div>
            <div className="jos order-1" data-jos_animation="fade-right">
              {/* Section Content Block */}
              <div className="mb-6">
                <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Empowering Learners Across All Industries</h2>
              </div>
              {/* Section Content Block */}
              <div className="">
                <p className="mb-8 text-lg text-gray-600 leading-relaxed lg:text-xl">
                  Global Skills Academy provides comprehensive learning solutions that cater to professionals, students, and organizations across various industries, helping them master the skills needed for todays digital world.
                </p>
                <ul className="flex flex-col gap-y-5 font-spaceGrotesk text-xl leading-tight tracking-tighter lg:mt-12 lg:text-[28px]">
                  <li className="flex items-start gap-x-3">
                    <div className="mt-[2.5px] h-[30px] w-[30px]">
                      <Image src="/assets/img_placeholder/th-4/icon-green-badge-check.svg" alt="check-circle" width={30} height={30} className="h-full w-full" />
                    </div>
                    Interactive learning with real-time progress tracking
                  </li>
                  <li className="flex items-start gap-x-3">
                    <div className="mt-[2.5px] h-[30px] w-[30px]">
                      <Image src="/assets/img_placeholder/th-4/icon-green-badge-check.svg" alt="check-circle" width={30} height={30} className="h-full w-full" />
                    </div>
                    Industry-recognized certifications and badges
                  </li>
                  <li className="flex items-start gap-x-3">
                    <div className="mt-[2.5px] h-[30px] w-[30px]">
                      <Image src="/assets/img_placeholder/th-4/icon-green-badge-check.svg" alt="check-circle" width={30} height={30} className="h-full w-full" />
                    </div>
                    24/7 access to expert-led course content
                  </li>
                </ul>
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

export default FeatureTwo;

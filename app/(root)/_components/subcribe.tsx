import Link from "next/link";
import React from "react";

const Subcribe = () => {
  return (
    <section>
      <div>
        <div className="rounded-[10px] bg-primary px-6 py-[60px] md:py-20 xl:py-[100px]">
          {/* Section Content Block */}
          <div className="jos mx-auto max-w-[500px] text-center lg:max-w-2xl xl:max-w-[840px]">
            <h2 className="font-spaceGrotesk text-4xl font-medium leading-[1.06] -tracking-[2px] text-black sm:text-[44px] lg:text-[56px] xl:text-[70px]">Protect your organization with the power of AI</h2>
          </div>
          {/* Section Content Block */}
          <div className="jos mt-8 flex flex-wrap justify-center gap-6 md:mt-[50px]" data-jos_animation="fade">
            <Link
              rel="noopener noreferrer"
              href="https://www.example.com"
              className="button inline-block h-full rounded border-2 border-transparent bg-black py-3 text-base text-colorGreen after:border-colorGreen after:bg-colorGreen hover:text-black"
            >
              Get Started Now
            </Link>
            <Link href="/pricing" className="button inline-block h-full rounded border-2 border-black bg-colorGreen py-3 text-base text-black after:bg-black hover:text-colorGreen">
              View Our Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subcribe;

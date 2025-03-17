import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Subscribe = () => {
  return (
    <section className="px-6 py-12 sm:px-8 lg:px-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 px-6 py-16 sm:px-12 md:py-20 xl:py-24">
        <div className="relative z-10">
          {/* Section Content Block */}
          <div className="mx-auto max-w-[500px] text-center lg:max-w-3xl xl:max-w-[880px]">
            <h2 className="font-heading mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Start Your Learning Journey Today</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">Join thousands of Indonesian students achieving their career goals through our free, industry-recognized courses</p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl ">
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/student/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl "
                >
                  Dashboard
                </Link>
              </SignedIn>
            </>

            <Link href="/about" className="inline-flex items-center justify-center rounded-full bg-background px-8 py-4 text-lg font-semibold text-foreground shadow-lg transition-all duration-300 hover:shadow-xl border border-border">
              Learn More
            </Link>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 dark:bg-white/5" />
        <div className="absolute left-0 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 dark:bg-white/3" />
      </div>
    </section>
  );
};

export default Subscribe;

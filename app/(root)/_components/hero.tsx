"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import AnimatedScrollWrapper from "./animation/animated-scroll-wrapper";

const Hero = () => {
  return (
    <AnimatedScrollWrapper animation="slideInLeft" delay={0.3} threshold={0.2} once={false}>
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Empowering Indonesia&apos;s
              <span className="relative mx-2 inline-block">
                <span className="relative z-10 bg-gradient-to-r from-green-600 to-primary bg-clip-text text-transparent ">Golden Generation 2045</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-green-200 dark:text-green-800" viewBox="0 0 100 12" preserveAspectRatio="none" style={{ width: "100%" }}>
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground lg:text-xl">
              An advanced Learning Management System developed by the Indonesian Students Association Worldwide, focusing on essential digital-era skills like digital marketing, export-import, and investment.
            </p>

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

          <div className="relative mt-16">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image src="/img/hero.jpg" alt="Hero main image" width={1200} height={600} className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </AnimatedScrollWrapper>
  );
};

export default Hero;

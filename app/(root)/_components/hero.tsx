import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section>
      <div className="relative z-[1] overflow-hidden text-center text-white">
        <div className="bg-[url('/hero.jpg')] bg-cover bg-no-repeat pb-20 pt-28 md:pb-[265px] md:pt-40 lg:pt-44 xl:pt-[224px]">
          <div className="mx-auto max-w-[1332px] px-4">
            <h1 className="jos mb-6 font-spaceGrotesk leading-none text-white">Next-gen AI solutions for cybersecurity</h1>
            <div className="mx-auto max-w-[1090px]">
              <p className="leading-[1.33] lg:text-xl xl:text-2xl">
                AI solutions for cyber security play a critical role in staying ahead of increasingly sophisticated cyber threats by providing faster, more accurate threat detection and response capabilities.
              </p>
            </div>
            <form action="#" method="post" className="jos mt-11 text-base font-bold">
              <div className="relative mx-auto h-[60px] max-w-[500px] overflow-hidden rounded">
                <input type="email" placeholder="Enter your email..." className="h-full w-full bg-colorCodGray px-6 pr-[150px]" required />
                <button type="submit" className="button absolute right-0 top-0 inline-block h-full rounded border-none bg-colorGreen py-0 text-black after:border-none after:bg-white">
                  Get Started
                </button>
              </div>
            </form>
            <div className="jos mt-4 flex items-center justify-center gap-x-[10px] text-center text-base">
              <Image src="/assets/img_placeholder/th-4/icon-green-badge-check.svg" alt="icon-green-badge-check.svg" width={20} height={20} className="inline-block" />
              <p>
                By signing up you agree to our
                <Link rel="noopener noreferrer" href="http://www.example.com" className="underline hover:text-colorGreen">
                  Terms &amp; Conditions.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

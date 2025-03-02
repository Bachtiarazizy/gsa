import Hero from "./_components/hero";
import Promo from "./_components/promo";
import FeatureOne from "./_components/feature-1";
import FeatureTwo from "./_components/feature-2";
import Courses from "./_components/courses";
import Marquee from "./_components/marquee";
import VideoPromo from "./_components/video-promo";
import WhyUs from "./_components/why-us";
import Faqs from "./_components/faqs";
import Testimonials from "./_components/testimonials";
import Subcribe from "./_components/subcribe";
import { Metadata } from "next";
import Collaborators from "./_components/colaborator";
import ScrollUpButton from "./_components/animation/scroll=up-button";
import OurPrograms from "./_components/our-programs";

export const metadata: Metadata = {
  title: "Home | Global Skills Academy",
  description: "Learn to code with our online courses.",
};

const Home = () => {
  return (
    <>
      <main className="relative overflow-hidden">
        <Hero />
        <Collaborators />
        <OurPrograms />
        <Promo />
        <FeatureOne />
        <FeatureTwo />

        {/* Separator */}
        <div className="global-container overflow-hidden">
          <div className="h-[1px] w-full bg-[#363636]" />
        </div>
        <Courses />
        <Marquee />
        <VideoPromo />
        <WhyUs />

        {/* Separator */}
        <div className="global-container overflow-hidden">
          <div className="h-[1px] w-full bg-[#363636]" />
        </div>

        <Faqs />
        <Testimonials />
        <Subcribe />

        <ScrollUpButton scrollThreshold={500} position="bottom-right" color="purple" icon="arrow" showLabel={true} pulseEffect={true} showScrollProgress={true} />
      </main>
    </>
  );
};

export default Home;

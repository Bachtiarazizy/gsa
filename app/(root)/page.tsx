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

const Home = () => {
  return (
    <>
      <main className="relative overflow-hidden">
        <Hero />
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
      </main>
    </>
  );
};

export default Home;

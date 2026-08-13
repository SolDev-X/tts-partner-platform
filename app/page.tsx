import HeroSection from "@/components/home/hero";
// import Logos from "@/components/home/logos";
import Services from "@/components/home/services";
import Process from "@/components/home/process";
import Testimonial from "@/components/home/testimonial";
// import Cta from "@/components/home/cta";
import FAQs from "@/components/home/faqs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Services />
      <Process />
      <Testimonial />
      <FAQs />
    </>
  );
}

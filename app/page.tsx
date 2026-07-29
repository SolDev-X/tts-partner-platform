import HeroSection from "@/components/home/hero";
import {Logos} from "@/components/home/logos";
import {Services} from "@/components/home/services";
import {Process} from "@/components/home/process";
import FAQs from "@/components/home/faqs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Logos />
      <Services />
      <Process />
      <FAQs />
    </>
  );
}

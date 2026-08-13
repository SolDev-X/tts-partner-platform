import HeroSection from "@/components/home/hero";
import Services from "@/components/home/services";
import Process from "@/components/home/process";
import Testimonial from "@/components/home/testimonial";
import FAQs from "@/components/home/faqs";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function Home() {
  return (
    <>
      <Header />
      <div>
        <HeroSection />
        <Services />
        <Process />
        <Testimonial />
        <FAQs />
      </div>
      <Footer />
    </>
  );
}

import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import ContinueBrowsing from "@/components/ContinueBrowsing";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhyRamEmpire from "@/components/WhyRamEmpire";
import FeaturedWork from "@/components/FeaturedWork";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Partners />
      <ContinueBrowsing />
      <FeaturedProjects />
      <WhyRamEmpire />
      <FeaturedWork />
      <Testimonials />
      <CTASection />
    </div>
  );
}

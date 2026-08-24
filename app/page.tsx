'use client';

import { useState } from 'react';
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import ContinueBrowsing from "@/components/ContinueBrowsing";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhyRamEmpire from "@/components/WhyRamEmpire";
import FeaturedWork from "@/components/FeaturedWork";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function Home() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Partners />
      <ContinueBrowsing
        activeLocation={activeLocation}
        onLocationChange={setActiveLocation}
      />
      <FeaturedProjects
        externalLocation={activeLocation}
        onExternalLocationClear={() => setActiveLocation(null)}
      />
      <WhyRamEmpire />
      <FeaturedWork />
      <Testimonials />
      <CTASection />
    </div>
  );
}

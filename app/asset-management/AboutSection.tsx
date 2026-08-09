'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const NAVY = '#1a2744';
const GOLD = '#C4A35A';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-14 md:py-20 bg-white" style={{ overflow: 'clip' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Left — Image: slides in from left */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0px)' : 'translateX(-150px)',
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="relative rounded-2xl overflow-hidden h-80 md:h-[420px] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop"
                alt="Luxury Property"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Decorative dots */}
            <div className="relative mt-3 ml-2">
              <div className="grid grid-cols-5 gap-1.5 w-fit opacity-40">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Content: slides in from right */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0px)' : 'translateX(150px)',
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: GOLD }}>ABOUT US</p>
              <div className="h-px w-14" style={{ backgroundColor: GOLD }} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ color: NAVY }}>
              We Don&apos;t Just Sell Properties,{' '}
              <span style={{ color: GOLD }}>We Manage Your Assets.</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                At Nexique Estate Housing Advisors, we are not just real estate consultants—we are{' '}
                <strong className="text-gray-800">Property Asset Managers.</strong>
              </p>
              <p>
                Your property is one of your most valuable investments, and our responsibility is to protect it, maintain it, maximize its returns, and ensure it remains occupied by verified tenants or is sold at the best possible value.
              </p>
              <p>
                Whether you own a single apartment, luxury villa, office, retail shop, warehouse, commercial building, or an entire portfolio of investment properties, we provide complete end-to-end Property Asset Management.
              </p>
              <p>
                With Nexique Estate Housing Advisors, you no longer need to coordinate with multiple brokers, tenants, maintenance vendors, or buyers. We become your single point of contact for everything related to your property.
              </p>
            </div>

            {/* Bottom tagline */}
            <div className="mt-7 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 w-fit">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${NAVY}15` }}>
                <svg className="w-5 h-5" fill="none" stroke={NAVY} strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="font-bold text-sm md:text-base" style={{ color: NAVY }}>
                You own the asset. We manage it.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

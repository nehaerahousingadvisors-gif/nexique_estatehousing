'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    id: 1,
    number: '1',
    heading: 'Complete\nProperty Asset Management',
    desc: 'We professionally manage your residential and commercial properties from start to finish, ensuring your investment remains secure, profitable, and hassle-free.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    stat: '98%',
    statLabel: 'of our clients retain tenants',
    bg: '#000',
  },
  {
    id: 2,
    number: '2',
    heading: 'Residential & Commercial\nProperty Management',
    desc: 'We manage: Apartments, Villas, Independent Houses, Builder Floors, Office Spaces',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    stat: '100%',
    statLabel: 'on-time collection guaranteed',
    bg: '#8b7cc8',
  },
  
  {
    id: 3,
    number: '3',
    heading: 'Exclusive\nProperty Marketing',
    desc: ' Your property receives priority marketing. Every buyer or tenant approaching Nexique Estate Housing Advisors is first introduced to your property before any other available properties.Marketing includes: ',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    stat: '10+',
    statLabel: 'years of industry experience',
    bg: '#000',
  },

  {
    id: 4,
    number: '4',
    heading: 'Leasing\nManagement',
    desc: 'Complete leasing assistance including:• Tenant Search •	Property Showings',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    stat: '100%',
    statLabel: 'on-time collection guaranteed',
    bg: '#8b7cc8',
  },

];

function useVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, visible } = useVisible();

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: service.bg, minHeight: '70vh' }}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 md:pt-14">

        {/* Top row: number + desc + image */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 items-start">

          {/* Left — number + desc */}
          <div
            className="flex-1 md:pr-16 md:pt-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            {/* Number circle */}
            <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center mb-5">
              <span className="text-white font-bold">{service.number}</span>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm">
              {service.desc}
            </p>
          </div>

          {/* Right — Tilted card */}
          <div
            className="flex-shrink-0 flex justify-center md:justify-end"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'rotate(-5deg) translateY(0)' : 'rotate(6deg) translateY(80px)',
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
            }}
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ width: '380px', height: '500px' }}
            >
              <Image
                src={service.image}
                alt={service.heading}
                fill
                sizes="380px"
                className="object-cover"
              />
              {/* Stat overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}
              >
                <p className="text-white text-5xl font-black leading-none">{service.stat}</p>
                <p className="text-white/75 text-xs mt-1">{service.statLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — divider + heading + learn more */}
        <div
          className="mt-6 pb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <div className="w-full h-px bg-white/20 mb-6" />
          <h3
            className="font-black text-white leading-none tracking-tight whitespace-pre-line mb-4"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}
          >
            {service.heading}
          </h3>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Learn more
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <div id="services">
      {services.map((s, i) => (
        <ServiceCard key={s.id} service={s} index={i} />
      ))}
    </div>
  );
}

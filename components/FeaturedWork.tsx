'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

interface WorkItem {
  id: number;
  image: string;
  title: string;
  category: string;
  hasLink?: boolean;
}

const workItems: WorkItem[] = [
  { id: 1, image: '/s2.png', title: 'SMART WORLD', category: '' },
  { id: 2, image: '/s2.png', title: 'SMART WORLD', category: '' },
  { id: 3, image: '/s3.png', title: 'SMART WORLD', category: '', hasLink: true },
  { id: 4, image: '/s4.png', title: 'SMART WORLD', category: '' },
  { id: 5, image: '/S1.png', title: 'SMART WORLD', category: '' },
  { id: 6, image: '/s2.png', title: 'SMART WORLD', category: '' },
];

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workItems.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const anglePerItem = 360 / workItems.length;
    setRotation(currentIndex * anglePerItem);
  }, [currentIndex]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const radius = isMobile ? 150 : 280;

  return (
    <section ref={sectionRef} className="w-full py-10 overflow-hidden relative" style={{ backgroundColor: '#1a2744' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest mb-2 text-gray-400">
            <span style={{ color: '#C4A35A' }} className="mr-2">⌐</span>FEATURED
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white">TOP PROJECT</h2>
        </div>
      </div>

      <div
        className="relative w-full h-[320px] sm:h-[500px] md:h-[600px] flex items-center justify-center"
        style={{ perspective: '1500px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          className="absolute"
          style={{
            transform: `rotateY(${-rotation}deg)`,
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
            transition: 'transform 1s ease-in-out',
          }}
        >
          {workItems.map((item, index) => {
            const angle = (360 / workItems.length) * index;
            const radians = (angle * Math.PI) / 180;
            return (
              <div
                key={item.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative w-[120px] sm:w-[200px] md:w-[280px] h-[180px] sm:h-[280px] md:h-[360px]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10">
                    <Image src={item.image} alt={item.title} fill className="object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 text-center">
                      <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-white mb-1 leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 sm:px-4 py-0.5 sm:py-1 rounded-full">
                      <p className="text-white font-medium text-[10px] sm:text-xs md:text-sm">{item.category}</p>
                    </div>
                    {item.hasLink && (
                      <button className="mt-2 w-full bg-white text-black font-bold px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors text-xs">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-white uppercase tracking-widest text-xs">EXPLORE PROJECTS</p>
      </div>
    </section>
  );
}

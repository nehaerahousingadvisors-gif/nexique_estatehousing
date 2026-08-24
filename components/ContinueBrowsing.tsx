'use client';

import { useRef } from 'react';

const NAVY = '#1a2744';

// Maps button label → the location keyword FeaturedProjects understands
const tabs = [
  { label: 'Buy in Noida',           location: 'Central Noida'      },
  { label: 'Buy in Greater Noida',   location: 'Greater Noida'      },
  { label: 'Buy in Central Noida',   location: 'Central Noida'      },
  { label: 'Buy on Yamuna Expressway', location: 'Yamuna Expressway' },
];

interface Props {
  activeLocation: string | null;
  onLocationChange: (loc: string | null) => void;
}

export default function ContinueBrowsing({ activeLocation, onLocationChange }: Props) {
  const featuredRef = useRef<HTMLElement | null>(null);

  const handleClick = (location: string) => {
    // Toggle — clicking the same button again clears the filter
    const next = activeLocation === location ? null : location;
    onLocationChange(next);

    // Smooth-scroll to the FeaturedProjects section after a short tick
    if (next) {
      setTimeout(() => {
        const el = document.getElementById('featured-projects');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  return (
    <section className="w-full bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-gray-400 mb-3 tracking-wide">Continue browsing...</p>

        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => {
            const isActive = activeLocation === tab.location;
            return (
              <button
                key={tab.label}
                onClick={() => handleClick(tab.location)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all whitespace-nowrap"
                style={{
                  borderColor: isActive ? NAVY : '#e5e7eb',
                  backgroundColor: isActive ? '#eef0f5' : 'white',
                  color: isActive ? NAVY : '#374151',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isActive ? NAVY : '#93c5fd'}
                  strokeWidth={1.8}
                >
                  <rect x="3" y="7" width="8" height="14" rx="1" />
                  <rect x="11" y="3" width="10" height="18" rx="1" />
                  <path strokeLinecap="round" d="M6 11h2M6 14h2M6 17h2" />
                  <path strokeLinecap="round" d="M14 7h4M14 11h4M14 15h4" />
                </svg>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

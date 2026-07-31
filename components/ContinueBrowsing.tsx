'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NAVY = '#1a2744';

const tabs = [
  { label: 'Buy on Noida', query: 'buy-noida' },
  { label: 'Buy on Greater Noida', query: 'buy-greater-noida' },
  { label: 'Buy on Central Noida', query: 'buy-central-noida' },
  { label: 'Buy on Yamuna Expressway', query: 'buy-yamuna-expressway' },
];

export default function ContinueBrowsing() {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = (tab: typeof tabs[0]) => {
    setActive(tab.query);
    router.push('/projects');
  };

  return (
    <section className="w-full bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-gray-400 mb-3 tracking-wide">Continue browsing...</p>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {tabs.map((tab) => {
            const isActive = active === tab.query;
            return (
              <button
                key={tab.query}
                onClick={() => handleClick(tab)}
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

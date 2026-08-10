'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultPartners = [
  "Vaastu Homes",
  "Godrej Nest",
  "Godrej Riverine - Tower 1",
  "Jacob & Co",
  "M3M Trump",
  "M3M The Line",
  "Grandthum By Group 108",
  "GYGY FIVEO",
];

export default function Partners() {
  const [partners, setPartners] = useState<string[]>(defaultPartners);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const q = query(collection(db, 'properties'));
        const snapshot = await getDocs(q);
        const names: string[] = [];
        const seen = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const data = doc.data() as Record<string, any>;
          const developer = (data.developer || data.developerName || '').toString().trim();
          const projectName = (data.projectName || data.name || '').toString().trim();

          if (developer && !seen.has(developer)) {
            seen.add(developer);
            names.push(developer);
          } else if (projectName && !seen.has(projectName)) {
            seen.add(projectName);
            names.push(projectName);
          }
        });

        if (names.length > 0) {
          setPartners(names);
        }
      } catch (err) {
        console.error('Partners: Firestore fetch failed:', err);
      }
    };
    fetchPartners();
  }, []);

  return (
     <section className="w-full py-4" style={{ backgroundColor: '#1a2744' }}>
      <div className="text-center mb-4">
        <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#C4A35A' }}>Our Trusted Developer Partners</h2>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{ animation: "marquee-left 20s linear infinite" }}
        >
          {[...partners, ...partners].map((project, index) => (
            <div key={index} className="text-xl sm:text-2xl font-bold text-white/80 tracking-wider">
              {project}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

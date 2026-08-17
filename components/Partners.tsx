'use client';

import Image from "next/image";

const partnerImages = [
  "ats.png",
  
  "108.png",
  
  "sobha12.png",
  "bhutani.png",
  // "dac.png",
  "m3m3.png",
  "image copy 3.png",
  "image copy 2.png",
  "smartworld1.png",
  // "gulshon.png",
  "image copy.png",
  "acc1.png",
  
];

const scaleMap: Record<string, number> = {
  
  "sobha12.png": 1.75,
  "bhutani.png": 1.55,
  "m3m3.png": 1.35,
  "max.png": 1.0,
  "108.png": 1.2,
  "smartworld1.png": 1.45,
  "acc1.png": 0.85,
  "image copy.png": 0.85,
  "image copy 2.png": 1.50,
  "ats.png": 0.85,
  "image copy 3.png": 2.90,
};

export default function Partners() {
  return (
     <section className="w-full py-4 bg-white border-y border-gray-200">
      <div className="text-center mb-4">
        <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#1a2744' }}>Our Trusted Developer Partners</h2>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-8 items-center"
          style={{ animation: "marquee-right 15s linear infinite" }}
        >
          {[...partnerImages, ...partnerImages].map((img, index) => {
            const scale = scaleMap[img] ?? 1.0;
            return (
              <div key={index} className="flex-shrink-0 flex items-center justify-center h-24 w-56 bg-white">
                <Image
                  src={`/${img}`}
                  alt={img.replace('.png', '')}
                  width={224}
                  height={96}
                  className="h-24 w-56 object-contain opacity-80 hover:opacity-100 transition-all duration-300"
                  style={{ transform: `scale(${scale})` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

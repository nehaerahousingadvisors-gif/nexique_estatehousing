"use client";

export default function PremiumBanner() {
  return (
    <div 
      className="w-full overflow-hidden py-3" 
      style={{ backgroundColor: "#1a2744" }}
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {[
          "Premium Luxury Apartments • ",
          "RERA Approved Projects • ",
          "Prime Locations in Delhi NCR • ",
          "500+ Happy Clients • ",
          "100% Transparent Deals • "
        ].map((text, index) => (
          <div key={index} className="flex items-center gap-6 px-8">
            <span className="text-white font-semibold tracking-wide flex items-center gap-3">
              <svg className="w-4 h-4" style={{ color: "#C4A35A" }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {text}
            </span>
          </div>
        ))}
        {[
          "Premium Luxury Apartments • ",
          "RERA Approved Projects • ",
          "Prime Locations in Delhi NCR • ",
          "500+ Happy Clients • ",
          "100% Transparent Deals • "
        ].map((text, index) => (
          <div key={`duplicate-${index}`} className="flex items-center gap-6 px-8">
            <span className="text-white font-semibold tracking-wide flex items-center gap-3">
              <svg className="w-4 h-4" style={{ color: "#C4A35A" }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {text}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}

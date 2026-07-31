"use client";

import React from "react";

export default function ScrollingBanner() {
  return (
    <div 
      className="w-full overflow-hidden py-2" 
      style={{ backgroundColor: "#000000", borderTop: "2px solid #C4A35A", borderBottom: "2px solid #C4A35A" }}
    >
      <div className="flex whitespace-nowrap animate-scroll-reverse">
        {/* Duplicate items for seamless loop */}
        {[...Array(15)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center gap-12 px-8"
          >
            <span 
              className="text-lg md:text-xl font-semibold tracking-widest"
              style={{ color: "#C4A35A" }}
            >
              Nexique Estate Housing Advisors
            </span>
            <div className="h-6 w-px" style={{ backgroundColor: "#C4A35A" }} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
}

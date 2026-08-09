'use client';

import { useState } from 'react';

const NAVY = '#1a2744';

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Anil Sharma',
      role: 'Homeowner, Noida',
      quote: 'A great experience with Nexique Estate Housing Advisors India while searching for a residential project in Delhi NCR. Super professional, transparent, and genuinely helpful throughout the process. Smooth and stress-free.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Investor, Gurugram',
      quote: 'Excellent service! They helped me find the perfect commercial property investment. Their market knowledge and guidance were invaluable. Highly recommended!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      role: 'First-time Buyer, Ghaziabad',
      quote: 'As a first-time buyer, I was nervous, but the team made everything so easy. From property search to paperwork, they handled it all with care.',
      rating: 5,
    },
  ];

  const current = testimonials[currentTestimonial];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: '#C4A35A' }}>TESTIMONIALS</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>What our clients say</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-[#1a2744] p-8 md:p-12 rounded-3xl border border-white/10 shadow-sm">
              <div className="mb-4" style={{ color: '#C4A35A' }}>
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="inline w-5 h-5" fill="#C4A35A" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-200 text-lg md:text-xl mb-6 leading-relaxed">{current.quote}</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#C4A35A' }}>
                  {current.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{current.name}</p>
                  <p className="text-gray-400 text-sm">{current.role}</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className="w-8 h-1 rounded-full transition-all"
                    style={{ backgroundColor: index === currentTestimonial ? '#C4A35A' : '#d1d5db' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-12">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: '#C4A35A' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

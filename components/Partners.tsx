export default function Partners() {
  const projects = [
    "Vaastu Homes",
    "Godrej Nest",
    "Godrej Riverine - Tower 1",
    "Jacob & Co",
    "M3M Trump",
    "M3M The Line",
    "Grandthum By Group 108",
    "GYGY FIVEO",
  ];

  return (
    <section className="w-full py-3" style={{ backgroundColor: '#1a2744' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#C4A35A' }}>Our Trusted Developer Partners</h2>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex gap-16 whitespace-nowrap"
            style={{ animation: "marquee-left 20s linear infinite" }}
          >
            {[...projects, ...projects].map((project, index) => (
              <div key={index} className="text-xl sm:text-2xl font-bold text-white/80 tracking-wider">
                {project}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

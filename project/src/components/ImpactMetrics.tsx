import { useEffect, useState, useRef } from 'react';

export default function ImpactMetrics() {
  const [counts, setCounts] = useState({ shortage: 0, people: 0, lives: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        shortage: Math.floor(64 * progress),
        people: Math.floor(30 * progress),
        lives: Math.floor(1000 * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({ shortage: 64, people: 30, lives: 1000 });
      }
    }, interval);
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-[#3B82F6] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-20">
          Counting What Matters
        </h2>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-6xl md:text-7xl font-bold text-white mb-4">
              {counts.shortage}%
            </div>
            <div className="text-xl text-white/90">
              Bed Shortage
              <br />
              in Odisha
            </div>
          </div>

          <div className="text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-6xl md:text-7xl font-bold text-white mb-4">
              {counts.people}M
            </div>
            <div className="text-xl text-white/90">
              People Helped
              <br />
              (Potential)
            </div>
          </div>

          <div className="text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-6xl md:text-7xl font-bold text-white mb-4">
              {counts.lives}+
            </div>
            <div className="text-xl text-white/90">
              Lives Saved
              <br />
              Daily
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
            <p className="text-2xl font-bold text-white">
              5+ Hospitals Integrated
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

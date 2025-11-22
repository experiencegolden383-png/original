import { useEffect, useRef, useState } from 'react';

export const useParallax = (offset = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset_, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const distance = windowHeight / 2 - elementCenter;
        setOffset(distance * offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return { ref, offset: offset_ };
};

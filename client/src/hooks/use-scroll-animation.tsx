import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      // Immediately add revealed class for instant loading - no lazy loading
      element.classList.add('revealed');
      
      // Add smooth entrance animation after a brief delay
      setTimeout(() => {
        element.classList.add('animate-fade-in');
      }, 100);
    }
  }, []);

  return elementRef;
}

export function useParallax() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const element = elementRef.current;
          if (!element) return;

          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.3; // Reduced parallax for better performance
          
          element.style.transform = `translateY(${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return elementRef;
}
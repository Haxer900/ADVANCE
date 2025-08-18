import { useEffect, ReactNode } from 'react';

interface PerformanceWrapperProps {
  children: ReactNode;
}

export function PerformanceWrapper({ children }: PerformanceWrapperProps) {
  useEffect(() => {
    // Disable smooth scrolling on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    }

    // Force hardware acceleration on scroll container
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      (scrollContainer as HTMLElement).style.transform = 'translateZ(0)';
      (scrollContainer as HTMLElement).style.backfaceVisibility = 'hidden';
    }

    // Optimize critical elements
    const criticalElements = document.querySelectorAll('header, main, footer, .video-container');
    criticalElements.forEach((el) => {
      (el as HTMLElement).style.transform = 'translateZ(0)';
      (el as HTMLElement).style.backfaceVisibility = 'hidden';
    });

    // Prevent layout thrashing
    const preventThrashing = () => {
      requestAnimationFrame(() => {
        // Batch DOM reads and writes
      });
    };

    window.addEventListener('scroll', preventThrashing, { passive: true });
    window.addEventListener('resize', preventThrashing, { passive: true });

    return () => {
      window.removeEventListener('scroll', preventThrashing);
      window.removeEventListener('resize', preventThrashing);
    };
  }, []);

  return <>{children}</>;
}
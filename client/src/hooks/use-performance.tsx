import { useEffect, useCallback, useRef } from 'react';

// Performance hook for smooth scrolling and optimization
export function usePerformanceOptimization() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Optimize scrolling performance
    const optimizeScrolling = () => {
      // Enable hardware acceleration for smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.overflowX = 'hidden';
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      document.body.style.overscrollBehavior = 'none';
    };

    // Debounced scroll handler for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    // Setup intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Add fade-in animation
            element.classList.add('animate-fade-in');
            
            // Remove will-change after animation
            setTimeout(() => {
              element.classList.add('animation-complete');
            }, 600);
            
            // Stop observing once animated
            observerRef.current?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );

    optimizeScrolling();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  // Function to observe elements for lazy loading
  const observeElement = useCallback((element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  return { observeElement };
}

// Hook for optimizing images
export function useImageOptimization() {
  const imageLoadPromises = useRef<Map<string, Promise<void>>>(new Map());

  const preloadImage = useCallback((src: string): Promise<void> => {
    if (imageLoadPromises.current.has(src)) {
      return imageLoadPromises.current.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });

    imageLoadPromises.current.set(src, promise);
    return promise;
  }, []);

  const lazyLoadImage = useCallback((
    imgElement: HTMLImageElement | null,
    src: string,
    placeholder?: string
  ) => {
    if (!imgElement) return;

    // Set placeholder if provided
    if (placeholder) {
      imgElement.src = placeholder;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            preloadImage(src).then(() => {
              img.src = src;
              img.classList.add('animate-fade-in');
            });
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px 0px' }
    );

    observer.observe(imgElement);
  }, [preloadImage]);

  return { preloadImage, lazyLoadImage };
}

// Hook for video optimization
export function useVideoOptimization() {
  const preloadVideo = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.oncanplaythrough = () => resolve();
      video.onerror = reject;
      video.preload = 'metadata';
      video.src = src;
    });
  }, []);

  const optimizeVideo = useCallback((videoElement: HTMLVideoElement | null) => {
    if (!videoElement) return;

    // Performance optimizations for video
    videoElement.style.willChange = 'auto';
    videoElement.style.transform = 'translateZ(0)';
    videoElement.style.backfaceVisibility = 'hidden';
    
    // Lazy load video
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            video.load();
            observer.unobserve(video);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);
  }, []);

  return { preloadVideo, optimizeVideo };
}
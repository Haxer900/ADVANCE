// Performance optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  static getInstance() {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Preload critical images
  preloadImages(urls: string[]) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Enable smooth scrolling with performance optimization
  enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add scroll performance optimization
    let ticking = false;
    const updateScrollPosition = () => {
      // Update any scroll-dependent elements here
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }, { passive: true });
  }

  // Optimize image loading
  optimizeImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!this.intersectionObserver) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              this.intersectionObserver?.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });
    }

    images.forEach(img => {
      this.intersectionObserver?.observe(img);
    });
  }

  // Debounce function for performance
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Throttle function for scroll events
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Optimize font loading
  optimizeFonts() {
    // Preload critical fonts
    const fonts = [
      'Inter',
      'Poppins'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Initialize all performance optimizations
  initialize() {
    this.enableSmoothScrolling();
    this.optimizeFonts();
    
    // Optimize for mobile devices
    if ('serviceWorker' in navigator) {
      // Future: Add service worker for caching
    }

    // Add critical CSS loading optimization
    document.addEventListener('DOMContentLoaded', () => {
      // Remove unused CSS classes after page load
      this.cleanupUnusedStyles();
    });
  }

  private cleanupUnusedStyles() {
    // Remove loading-specific styles after page load
    const loadingStyles = document.querySelectorAll('style[data-loading]');
    loadingStyles.forEach(style => style.remove());
  }
}

// Initialize performance optimizations
export const initializePerformance = () => {
  const optimizer = PerformanceOptimizer.getInstance();
  optimizer.initialize();
};

// Export commonly used functions
export const { debounce, throttle } = PerformanceOptimizer.getInstance();
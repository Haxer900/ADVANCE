// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private scrollThrottled = false;
  private resizeThrottled = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Optimize scroll performance
  optimizeScrolling(): void {
    // Remove smooth scrolling on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    }

    // Throttle scroll events
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Minimal scroll handling
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, {
      passive: true,
      capture: false
    });
  }

  // Force hardware acceleration only where needed
  optimizeElements(): void {
    const criticalElements = [
      '.hero-video',
      '.sticky-header',
      '.floating-cart',
      '.product-image'
    ];

    criticalElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        (el as HTMLElement).style.transform = 'translateZ(0)';
        (el as HTMLElement).style.backfaceVisibility = 'hidden';
      });
    });
  }

  // Remove unnecessary animations
  disableAnimationsOnMobile(): void {
    if (window.innerWidth <= 768) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          animation-duration: 0ms !important;
          animation-delay: 0ms !important;
          transition-duration: 0ms !important;
          transition-delay: 0ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize all optimizations
  init(): void {
    this.optimizeScrolling();
    this.optimizeElements();
    this.disableAnimationsOnMobile();
    
    // Monitor performance
    if ('performance' in window) {
      console.log('Performance optimizations initialized');
    }
  }
}
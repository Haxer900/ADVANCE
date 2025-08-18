import { useEffect, ReactNode } from 'react';
import { PerformanceMonitor } from '@/utils/performance-monitor';

interface PerformanceWrapperProps {
  children: ReactNode;
}

export function PerformanceWrapper({ children }: PerformanceWrapperProps) {
  useEffect(() => {
    // Initialize performance monitor
    const monitor = PerformanceMonitor.getInstance();
    monitor.init();

    // Additional cleanup
    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
}
import { useEffect, useState } from "react";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide preloader after React app fully loads
    const hidePreloader = () => {
      const preloader = document.getElementById("loading-overlay");
      const root = document.getElementById("root");
      
      if (preloader && root) {
        // Ensure root is visible first
        root.classList.add("loaded");
        
        // Then hide preloader
        preloader.classList.add("hidden");
        
        // Allow scrolling again
        document.body.classList.remove("loading");
        document.body.style.overflow = "visible";
        
        // Remove preloader from DOM after animation
        setTimeout(() => {
          setIsVisible(false);
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 300);
      }
    };

    // Wait for fonts and critical resources to load
    Promise.all([
      document.fonts.ready,
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', resolve);
        }
      })
    ]).then(() => {
      // Add small delay for smooth transition
      setTimeout(hidePreloader, 800);
    });

    // Fallback timeout
    const fallbackTimer = setTimeout(hidePreloader, 3000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!isVisible) return null;

  return null; // The preloader is handled in HTML for immediate display
}
import { useEffect, useState } from "react";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide preloader after React app fully loads
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      const root = document.getElementById("root");
      
      if (preloader && root) {
        // Ensure root is visible first
        root.classList.add("loaded");
        
        // Then hide preloader
        preloader.classList.add("hidden");
        
        // Allow scrolling again
        document.body.style.overflow = "visible";
        
        // Remove preloader from DOM after animation
        setTimeout(() => {
          setIsVisible(false);
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 500);
      }
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return null; // The preloader is handled in HTML for immediate display
}
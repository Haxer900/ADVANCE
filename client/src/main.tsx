import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializePerformance } from "./lib/performance";

// Initialize performance optimizations immediately
initializePerformance();

// Add loading class to body immediately
document.body.classList.add("loading");

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root")!;
  const loadingOverlay = document.getElementById("loading-overlay")!;
  
  // Mount React app
  createRoot(rootElement).render(<App />);
  
  // Wait for everything to load completely
  const hideLoader = () => {
    // Remove blur effect from root with smooth transition
    rootElement.classList.add("loaded");
    
    // Hide loading overlay first
    loadingOverlay.classList.add("hidden");
    
    // Enable interactions after a brief delay to ensure smooth transition
    setTimeout(() => {
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.touchAction = "";
    }, 300);
    
    // Remove overlay from DOM after transition completes
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }, 1000); // Match the transition duration
  };
  
  // Wait for all assets to load
  const loadComplete = () => {
    Promise.all([
      // Wait for fonts to load
      document.fonts.ready,
      // Wait for images to load
      new Promise((resolve) => {
        const images = Array.from(document.images);
        if (images.length === 0) {
          resolve(true);
          return;
        }
        
        let loadedCount = 0;
        const checkComplete = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            resolve(true);
          }
        };
        
        images.forEach(img => {
          if (img.complete) {
            checkComplete();
          } else {
            img.addEventListener('load', checkComplete);
            img.addEventListener('error', checkComplete);
          }
        });
      }),
      // Wait for React to fully render
      new Promise((resolve) => {
        const checkReactReady = () => {
          if (rootElement.children.length > 0) {
            resolve(true);
          } else {
            setTimeout(checkReactReady, 50);
          }
        };
        checkReactReady();
      })
    ]).then(() => {
      // Add small delay for smooth transition and to ensure content is ready
      setTimeout(hideLoader, 500);
    }).catch(() => {
      // Fallback in case of errors - always hide loader
      setTimeout(hideLoader, 1500);
    });
  };

  // Start the loading process
  loadComplete();
});

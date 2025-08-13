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
    // Remove blur effect from root
    rootElement.classList.add("loaded");
    
    // Enable interactions by removing loading class
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
    document.body.style.overflow = "";
    
    // Hide loading overlay
    loadingOverlay.classList.add("hidden");
    
    // Remove overlay from DOM after transition
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }, 800); // Match the transition duration
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
      // Add small delay for smooth transition
      setTimeout(hideLoader, 300);
    }).catch(() => {
      // Fallback in case of errors
      setTimeout(hideLoader, 1000);
    });
  };

  // Start the loading process
  loadComplete();
});

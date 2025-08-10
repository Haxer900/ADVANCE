import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

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
    // Enable scrolling by removing loading class and restoring body overflow
    document.body.classList.remove("loading");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.height = "";
    document.documentElement.style.overflow = "";
    
    // Show root content
    rootElement.classList.add("loaded");
    
    // Hide loading overlay
    loadingOverlay.classList.add("hidden");
    
    // Remove overlay from DOM after transition
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }, 500);
  };
  
  // Wait for React to mount and render, then hide loader
  setTimeout(() => {
    // Check if React has rendered by looking for content
    if (rootElement.children.length > 0) {
      hideLoader();
    } else {
      // If not ready, wait a bit more
      setTimeout(hideLoader, 300);
    }
  }, 800);
});

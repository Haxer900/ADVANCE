import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root")!;
  const loadingOverlay = document.getElementById("loading-overlay")!;
  
  // Add loading class to blur the content initially
  rootElement.classList.add("loading");
  
  // Mount React app
  createRoot(rootElement).render(<App />);
  
  // Hide loading overlay after React app is ready
  setTimeout(() => {
    rootElement.classList.remove("loading");
    loadingOverlay.classList.add("hidden");
    
    // Remove overlay from DOM after transition
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }, 300);
  }, 500); // Reduced timing for faster loading
});

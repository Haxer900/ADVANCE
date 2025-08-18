import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializePerformance } from "./lib/performance";

// Initialize performance optimizations immediately
initializePerformance();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root")!;
  
  // Mount React app immediately
  createRoot(rootElement).render(<App />);
});

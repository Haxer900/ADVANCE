import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root")!;
  
  // Show the root element after React app mounts
  setTimeout(() => {
    rootElement.classList.add("loaded");
    // Allow body to scroll again after preloader
    document.body.style.overflow = "visible";
  }, 100);
  
  createRoot(rootElement).render(<App />);
});

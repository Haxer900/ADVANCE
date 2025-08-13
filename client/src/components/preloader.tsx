import { useEffect, useState } from "react";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // The preloader is now handled entirely in main.tsx and HTML
    // This component is just a placeholder for compatibility
    setIsVisible(false);
  }, []);

  return null; // The preloader is handled in HTML for immediate display with blurred content
}
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zenthra-gold focus:ring-offset-2 bg-gradient-to-br from-zenthra-black to-neutral-800 hover:from-zenthra-gold hover:to-amber-500 text-white hover:text-zenthra-black border-2 border-zenthra-gold hover:border-amber-400 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300" />
    </button>
  );
}
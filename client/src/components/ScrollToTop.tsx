import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] hidden lg:block">
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full shadow-lg bg-[#243240] hover:bg-[#243240]/90 text-white transition-all duration-300"
        data-testid="button-scroll-to-top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </div>
  );
}

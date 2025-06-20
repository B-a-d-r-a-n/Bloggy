import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { useScrollPosition } from "../../hooks/useScrollPosition"; 
import { cn } from "../../lib/utils"; 
export function ScrollToTopButton() {
  const scrollPosition = useScrollPosition();
  const isVisible = scrollPosition > 400;
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  };
  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "btn btn-circle btn-primary fixed bottom-20 right-6 z-50 shadow-lg",
        "transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}
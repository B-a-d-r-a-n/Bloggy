import { useState, useEffect } from "react";

// This hook returns the current vertical scroll position of the window.
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    // Add event listener on mount
    window.addEventListener("scroll", updatePosition);

    // Initial call to set position
    updatePosition();

    // Cleanup event listener on unmount
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};

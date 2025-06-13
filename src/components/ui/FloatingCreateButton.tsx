// src/components/layout/FloatingCreateButton.tsx

import { Link } from "@tanstack/react-router";
import { PlusIcon } from "@heroicons/react/24/solid"; // Or PlusCircleIcon

// --- Placeholder Auth Hook ---
// In a real app, you'd import this from your actual hooks file.
const useAuth = () => {
  const isAuthenticated = true; // <-- CHANGE to false to hide the button
  return { isAuthenticated };
};
// --- End Placeholder Hook ---

export function FloatingCreateButton() {
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, render nothing.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      to="/articles/action"
      className="btn btn-primary btn-circle fixed bottom-6 right-6 z-50 shadow-lg 
                 transform transition-transform duration-300 ease-in-out hover:scale-110"
      aria-label="Create or edit an article"
    >
      <PlusIcon className="h-8 w-8" />
    </Link>
  );
}

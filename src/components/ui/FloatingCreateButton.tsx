// src/components/layout/FloatingCreateButton.tsx

import { Link } from "@tanstack/react-router";
import { PlusIcon } from "@heroicons/react/24/solid"; // Or PlusCircleIcon
import { useAuth } from "../../hooks/useAuth";

// --- Placeholder Auth Hook ---
// In a real app, you'd import this from your actual hooks file.

// --- End Placeholder Hook ---

export function FloatingCreateButton() {
  const { user } = useAuth();

  // If the user is not authenticated, render nothing.
  if (!user) {
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

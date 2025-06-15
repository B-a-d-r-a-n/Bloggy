import { Link } from "@tanstack/react-router";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../hooks/useAuth";

export function FloatingCreateButton() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Link
      to="/articles/action"
      // --- THIS IS THE FIX ---
      // Provide the required search params for this route.
      // We are explicitly telling the router to open the page in 'create' mode.
      search={{ mode: "create" }}
      className="btn btn-primary btn-circle fixed bottom-6 right-6 z-50 shadow-lg 
                 transform transition-transform duration-300 ease-in-out hover:scale-110"
      aria-label="Create new article"
    >
      <PlusIcon className="h-8 w-8" />
    </Link>
  );
}

import { Link } from "@tanstack/react-router";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCurrentUser } from "../../features/auth/queries";
export function FloatingCreateButton() {
  const { data: user } = useCurrentUser();
  //todo:manage author status
  if (!user /*|| (user.role !== "author" && user.role !== "admin")*/) {
    return null;
  }
  return (
    <Link
      to="/articles/action"
      search={{ mode: "create" }}
      className="btn btn-primary btn-circle fixed bottom-6 right-6 z-50 shadow-lg 
                 transform transition-transform duration-300 ease-in-out hover:scale-110"
      aria-label="Create new article"
    >
      <PlusIcon className="h-8 w-8" />
    </Link>
  );
}

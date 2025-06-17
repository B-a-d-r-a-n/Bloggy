import { StarIcon } from "@heroicons/react/24/solid";
import { useToggleStar } from "../queries";
import { cn } from "../../../lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUser } from "../../auth/queries";

interface StarButtonProps {
  articleId: string;
  starredBy: string[];
  starsCount: number;
}

export default function StarButton({
  articleId,
  starredBy,
  starsCount,
}: StarButtonProps) {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  const toggleStarMutation = useToggleStar();

  const handleStar = () => {
    // If user is not logged in, navigate them to the login page
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    // Call mutate with just the article ID
    toggleStarMutation.mutate(articleId);
  };

  const isStarred = user ? starredBy.includes(user._id) : false;

  return (
    <button
      onClick={handleStar}
      // The button is disabled only while the mutation is pending
      disabled={toggleStarMutation.isPending}
      className="btn btn-ghost btn-sm flex items-center gap-2"
      title={isStarred ? "Unstar this article" : "Star this article"}
    >
      <StarIcon
        className={cn(
          "w-6 h-6 transition-all transform",
          isStarred
            ? "text-warning scale-110"
            : "text-base-content/40 hover:text-warning/80 hover:scale-110"
        )}
      />
      <span className="font-bold text-lg">{starsCount}</span>
    </button>
  );
}

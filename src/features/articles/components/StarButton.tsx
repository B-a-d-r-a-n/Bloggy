import { StarIcon } from "@heroicons/react/24/solid";
import { useToggleStar } from "../queries";
import { cn } from "../../../lib/utils";
import { useCurrentUser } from "../../auth/queries";
import toast from "react-hot-toast";

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
  const toggleStarMutation = useToggleStar();

  const handleStar = () => {
    // If user is not logged in
    if (!user) {
      toast.error("You must be logged in to star articles !");
      return;
    }
    // Call mutate with just the article ID
    toggleStarMutation.mutate(articleId);
  };

  const isStarred = user ? starredBy.includes(user._id) : false;

  return (
    <button
      onClick={handleStar}
      disabled={toggleStarMutation.isPending}
      className="btn btn-ghost btn-sm flex items-center gap-2 group" // Added `group`
      title={isStarred ? "Unstar this article" : "Star this article"}
    >
      <StarIcon
        className={cn(
          "w-6 h-6 transition-all transform",
          isStarred
            ? "text-warning"
            : // The icon is gray by default, but turns yellow when the PARENT button is hovered.
              // using group-hover
              "text-base-content/40 group-hover:text-warning/80 group-hover:scale-110"
        )}
      />
      <span className="font-bold text-lg">{starsCount}</span>
    </button>
  );
}

import { Link } from "@tanstack/react-router";
import { useInfiniteArticles } from "../../articles/queries";
import ArticleList from "../../articles/components/ArticleList"; // Reusing our dumb component
import EmptyState from "../../../components/ui/EmptyState"; // Reusing our EmptyState component
import { PencilSquareIcon, NewspaperIcon } from "@heroicons/react/24/outline";

interface ProfileArticleListProps {
  authorId: string;
  authorName: string;
  isOwnProfile: boolean;
}

export default function ProfileArticleList({
  authorId,
  authorName,
  isOwnProfile,
}: ProfileArticleListProps) {
  // Fetch the articles for this specific author
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles({ author: authorId });

  // The main ArticleList component already handles the `isLoading` state by showing skeletons.
  // We only need to handle the final state (empty or not).

  const totalArticles = data?.pages[0]?.pagination.totalItems ?? 0;

  // Don't render anything until the initial fetch is complete
  if (isLoading) {
    return (
      <div className="mt-16 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="mt-16 text-center text-error">
        Could not load articles for this user.
      </p>
    );
  }

  // --- THIS IS THE NEW UX LOGIC ---
  if (totalArticles === 0) {
    // If the list is empty, decide which message to show
    if (isOwnProfile) {
      // Message for the logged-in user viewing their own empty profile
      return (
        <div className="mt-16">
          <EmptyState
            icon={<PencilSquareIcon />}
            title="You haven't written any articles yet"
            description="Time to share your ideas! Your articles will appear here once you've published them."
            action={
              <Link
                to="/articles/action"
                search={{ mode: "create" }}
                className="btn btn-primary"
              >
                Write Your First Article
              </Link>
            }
          />
        </div>
      );
    } else {
      // Message for a visitor viewing someone else's empty profile
      return (
        <div className="mt-16">
          <EmptyState
            icon={<NewspaperIcon />}
            title="No Articles Published"
            description={`${authorName} hasn't published any articles yet. Check back later!`}
          />
        </div>
      );
    }
  }

  // If there are articles, render the list
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 text-center sm:text-left">
        {isOwnProfile ? "Your Articles" : `Articles by ${authorName}`}
      </h3>
      <ArticleList
        data={data}
        isLoading={isLoading} // Will be false here, but good practice to pass
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}

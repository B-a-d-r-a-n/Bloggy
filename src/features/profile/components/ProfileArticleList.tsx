import { Link } from "@tanstack/react-router";
import { useInfiniteArticles } from "../../articles/queries";
import ArticleList from "../../articles/components/ArticleList";
import EmptyState from "../../../components/ui/EmptyState";
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
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles({ author: authorId });
  const totalArticles = data?.pages[0]?.pagination.totalItems ?? 0;
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
  if (totalArticles === 0) {
    if (isOwnProfile) {
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
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 text-center sm:text-left">
        {isOwnProfile ? "Your Articles" : `Articles by ${authorName}`}
      </h3>
      <ArticleList
        data={data}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}

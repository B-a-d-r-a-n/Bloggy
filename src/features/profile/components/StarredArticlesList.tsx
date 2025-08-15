import { useGetStarredArticles } from "../queries";
import ArticleCard from "../../articles/components/ArticleCard";
import EmptyState from "../../../components/ui/EmptyState";
import { StarIcon } from "@heroicons/react/24/outline";

interface StarredArticlesListProps {
  userId: string;
  isOwnProfile: boolean;
  userName?: string;
}

export default function StarredArticlesList({
  userId,
  isOwnProfile,
  userName,
}: StarredArticlesListProps) {
  const { data: articles, isLoading } = useGetStarredArticles(userId);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <EmptyState
        icon={<StarIcon />}
        title={
          isOwnProfile
            ? "No Starred Articles"
            : `${userName || "User"} hasn't starred any articles yet`
        }
        description={
          isOwnProfile
            ? "Articles you star will be collected here for easy access."
            : "Check back later for starred articles from this user."
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}

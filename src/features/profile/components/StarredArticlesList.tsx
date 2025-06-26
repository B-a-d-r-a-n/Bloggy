import { useGetStarredArticles } from "../queries";
import ArticleCard from "../../articles/components/ArticleCard";
import EmptyState from "../../../components/ui/EmptyState";
import { StarIcon } from "@heroicons/react/24/outline";

export default function StarredArticlesList() {
  const { data: articles, isLoading } = useGetStarredArticles();

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
        title="No Starred Articles"
        description="Articles you star will be collected here for easy access."
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

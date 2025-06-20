import { createFileRoute } from "@tanstack/react-router";
import { useGetArticleById } from "../../features/articles/queries";
import ArticleDetailDisplay from "../../features/articles/components/ArticleDetailDisplay";
import CommentSection from "../../features/comments/components/CommentSection";
export const Route = createFileRoute("/articles/$articleId")({
  component: ArticleDetailPage,
});
function ArticleDetailPage() {
  const { articleId } = Route.useParams();
  const { data: article, isLoading, error } = useGetArticleById(articleId);
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-base-300 rounded w-1/4 mx-auto"></div>
        <div className="h-16 bg-base-300 rounded w-3/4 mx-auto"></div>
        <div className="h-10 bg-base-300 rounded w-1/2 mx-auto"></div>
        <div className="h-96 bg-base-300 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-6 bg-base-300 rounded"></div>
          <div className="h-6 bg-base-300 rounded w-5/6"></div>
          <div className="h-6 bg-base-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div role="alert" className="alert alert-error max-w-2xl mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! Could not load the article. {error.message}</span>
      </div>
    );
  }
  return (
    <div className="py-8 lg:py-12">
      <ArticleDetailDisplay article={article!} />
      {}
      <div className="max-w-4xl mx-auto mt-16">
        <CommentSection
          totalCommentCount={article!.totalCommentCount}
          articleId={article!._id}
        />
      </div>
    </div>
  );
}

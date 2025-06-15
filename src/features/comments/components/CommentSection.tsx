import { useGetComments, usePostComment } from "../queries";
import { useAuth } from "../../../hooks/useAuth";
import CommentItem from "./ComentItem";
import CommentForm from "./CommentForm";
interface CommentSectionProps {
  articleId: string;
}
export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetComments(articleId);
  const postCommentMutation = usePostComment(articleId);
  const handleCommentSubmit = (text: string) => {
    postCommentMutation.mutate(text);
  };
  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p className="text-error">Could not load comments.</p>;
  const comments = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2">
        Comments ({data?.pages[0].pagination.totalItems || 0})
      </h2>
      {}
      {user ? (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={postCommentMutation.isPending}
        />
      ) : (
        <p>You must be logged in to comment.</p>
      )}
      {}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            articleId={articleId}
            comment={comment}
          />
        ))}
      </div>
      {}
      {hasNextPage && (
        <div className="text-center">
          <button
            className="btn btn-ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more..." : "Load More Comments"}
          </button>
        </div>
      )}
    </div>
  );
}

import { useGetComments, usePostComment } from "../queries";
import CommentForm from "./CommentForm";
import { Link } from "@tanstack/react-router";
import CommentItem from "./ComentItem";
import { useCurrentUser } from "../../auth/queries";

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { data: user } = useCurrentUser();
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

  const comments = data?.pages.flatMap((page) => page.data) ?? [];
  const totalComments = data?.pages[0]?.pagination.totalItems ?? 0;

  return (
    <div id="comment-section" className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold border-b border-base-300 pb-4">
        {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
      </h2>

      {/* New Comment Form */}
      <div>
        {user ? (
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={postCommentMutation.isPending}
          />
        ) : (
          <p className="text-center text-base-content/70">
            <Link to="/login" className="link link-primary">
              Log in
            </Link>{" "}
            or{" "}
            <Link to="/signup" className="link link-primary">
              sign up
            </Link>{" "}
            to leave a comment.
          </p>
        )}
      </div>

      {/* List of Comments */}
      {isLoading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-error">Could not load comments.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              articleId={articleId}
            />
          ))}
        </div>
      )}

      {/* "Load More" Button */}
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

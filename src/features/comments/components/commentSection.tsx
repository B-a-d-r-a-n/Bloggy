import React from "react";
import { useGetComments, usePostComment } from "../queries";
import { useAuth } from "../../../hooks/useAuth";
import CommentForm from "./commentForm";
import CommentItem from "./coomentItem";

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

  // Need to get current user for optimistic update
  const postCommentMutation = usePostComment(articleId);

  const handleCommentSubmit = (text: string) => {
    // The `mutate` function takes the `text` of the comment, which matches
    // the `mutationFn` in the hook: `(text: string) => commentService.postComment(...)`
    postCommentMutation.mutate(text);
  };

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p className="text-error">Could not load comments.</p>;

  // Flatten the pages array into a single comments array
  const comments = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2">
        Comments ({data?.pages[0].pagination.totalItems || 0})
      </h2>

      {/* New Comment Form */}
      {user ? (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={postCommentMutation.isPending}
        />
      ) : (
        <p>You must be logged in to comment.</p>
      )}

      {/* List of Comments */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            articleId={articleId}
            comment={comment}
          />
        ))}
      </div>

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

import React, { useState } from "react";
import type { PopulatedComment } from "../../../core/types/comment";
import { useAuth } from "../../../hooks/useAuth";
import CommentForm from "./commentForm";
// Import reply mutation hook later
import { useDeleteComment, usePostReply } from "../queries";

interface CommentItemProps {
  comment: PopulatedComment;
  articleId: string;
}

export default function CommentItem({ comment, articleId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { user } = useAuth();

  // The hook just needs the articleId to know which list to invalidate on success.
  const postReplyMutation = usePostReply(articleId);
  const deleteCommentMutation = useDeleteComment(articleId);
  const handleReplySubmit = (text: string) => {
    // Call `mutate` with an object that has both `commentId` and `text`.
    postReplyMutation.mutate(
      { commentId: comment._id, text: text },
      {
        onSuccess: () => {
          // This component-level onSuccess is great for UI-specific actions.
          setIsReplying(false);
        },
      }
    );
  };
  const handleDelete = () => {
    // Add guard clause for safety
    if (!comment._id) {
      console.error("Cannot delete, comment ID is missing.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(comment._id);
    }
  };
  const isOwner = user?._id === comment.author._id;

  return (
    <div className="flex gap-4">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <img
            src={comment.author.avatarUrl || "/default-avatar.png"}
            alt={comment.author.name}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold">{comment.author.name}</span>
          <span className="text-xs text-base-content/60">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="py-2">{comment.text}</p>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => setIsReplying(!isReplying)}
          >
            {isReplying ? "Cancel" : "Reply"}
          </button>
          {/* --- THIS IS THE FIX --- */}
          {isOwner && (
            <button
              className="btn btn-xs btn-ghost text-error"
              onClick={handleDelete}
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Delete"
              )}
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReplySubmit}
              isSubmitting={false /* postReplyMutation.isPending */}
              submitLabel="Reply"
            />
          </div>
        )}

        {/* Render replies here */}
        <div className="mt-4 space-y-4">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply._id}
              articleId={articleId}
              comment={reply}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

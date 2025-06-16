import type { PopulatedComment } from "../../../core/types/comment";
import { useAuth } from "../../../hooks/useAuth";
import { useDeleteComment, usePostReply } from "../queries";
import { getUserAvatar } from "../../../lib/utils";
import { useState } from "react";
import CommentForm from "./CommentForm";
interface CommentItemProps {
  comment: PopulatedComment;
  articleId: string;
}
export default function CommentItem({ comment, articleId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { user } = useAuth();
  const postReplyMutation = usePostReply(articleId);
  const deleteCommentMutation = useDeleteComment(articleId);
  const handleReplySubmit = (text: string) => {
    postReplyMutation.mutate(
      { commentId: comment._id, text: text },
      {
        onSuccess: () => {
          setIsReplying(false);
        },
      }
    );
  };
  const handleDelete = () => {
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
            src={getUserAvatar(comment.author.name, comment.author.avatarUrl)}
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
        {user && (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => setIsReplying(!isReplying)}
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
            {}
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
        )}

        {isReplying && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReplySubmit}
              isSubmitting={false}
              submitLabel="Reply"
            />
          </div>
        )}
        {}
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

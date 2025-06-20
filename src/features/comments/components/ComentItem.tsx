import { Link } from "@tanstack/react-router"; 
import type { PopulatedComment } from "../../../core/types/comment";
import { usePostReply, useDeleteComment, useUpdateComment } from "../queries";
import CommentForm from "./CommentForm";
import { getUserAvatar } from "../../../lib/utils";
import { useCurrentUser } from "../../auth/queries";
import { useState } from "react";
interface CommentItemProps {
  comment: PopulatedComment;
  articleId: string;
}
export default function CommentItem({ comment, articleId }: CommentItemProps) {
  const { data: user } = useCurrentUser();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const postReplyMutation = usePostReply(articleId);
  const deleteCommentMutation = useDeleteComment(articleId);
  const updateCommentMutation = useUpdateComment(articleId);
  const isOwner = user?._id === comment.author._id;
  const handleReplySubmit = (text: string) => {
    postReplyMutation.mutate(
      { commentId: comment._id, text },
      { onSuccess: () => setIsReplying(false) }
    );
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(comment._id);
    }
  };
  const handleUpdateSubmit = (text: string) => {
    updateCommentMutation.mutate(
      { commentId: comment._id, text },
      { onSuccess: () => setIsEditing(false) }
    );
  };
  if (!comment.author) return null;
  return (
    <div className="flex gap-3 items-start">
      <Link
        to="/profile/$userId"
        params={{ userId: comment.author._id }}
        className="avatar flex-shrink-0"
      >
        <div className="w-10 h-10 rounded-full">
          <img
            src={getUserAvatar(comment.author.name, comment.author.avatarUrl)}
            alt={comment.author.name}
          />
        </div>
      </Link>
      <div className="flex-1">
        <div className="bg-base-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <Link
              to="/profile/$userId"
              params={{ userId: comment.author._id }}
              className="font-bold text-base-content link link-hover"
            >
              {comment.author.name}
            </Link>
            <span className="text-xs text-base-content/60">
              • {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                onSubmit={handleUpdateSubmit}
                isSubmitting={updateCommentMutation.isPending}
                initialText={comment.text}
                submitLabel="Save"
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <p className="py-2 text-base-content/90 whitespace-pre-wrap">
              {comment.text}
            </p>
          )}
        </div>
        {user && !isEditing && (
          <div className="flex items-center gap-2 text-xs font-medium text-base-content/60 pl-2 pt-1">
            <button
              className="hover:text-primary"
              onClick={() => setIsReplying(!isReplying)}
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
            {isOwner && (
              <>
                <span>•</span>
                <button
                  className="hover:text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <span>•</span>
                <button
                  className="hover:text-error"
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                >
                  {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        )}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReplySubmit}
              isSubmitting={postReplyMutation.isPending}
              submitLabel="Post Reply"
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-6 border-l-2 border-base-300 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                articleId={articleId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useGetUserComments } from "../queries";
import { Link } from "@tanstack/react-router";
import EmptyState from "../../../components/ui/EmptyState";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function UserCommentsList() {
  const { data: comments, isLoading } = useGetUserComments();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleLeftRightIcon />}
        title="No Comments Yet"
        description="Your comments on other articles will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="card bg-base-200 shadow-sm">
          <div className="card-body p-6">
            <p className="italic text-base-content/90">"{comment.text}"</p>
            <div className="card-actions justify-end mt-4 border-t border-base-300 pt-4">
              <Link
                to={`/articles/$articleId`}
                params={{ articleId: comment.article }}
                className="link link-primary font-semibold text-sm"
              >
                View article ?
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

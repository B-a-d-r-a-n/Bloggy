import { Link } from "@tanstack/react-router";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useGetUserComments } from "../queries";
import EmptyState from "../../../components/ui/EmptyState";

interface UserCommentsListProps {
  userId: string;
  isOwnProfile: boolean;
  userName?: string;
}

export default function UserCommentsList({ userId, isOwnProfile, userName }: UserCommentsListProps) {
  const { data: comments, isLoading } = useGetUserComments(userId);

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
        title={isOwnProfile ? "No Comments Yet" : `${userName || "User"} hasn't commented yet`}
        description={isOwnProfile ? "Your comments on other articles will appear here." : "Check back later for comments from this user."}
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
                View article
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

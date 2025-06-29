import { createFileRoute } from "@tanstack/react-router";
import UserCommentsList from "../../../features/profile/components/UserCommentsList";

export const Route = createFileRoute("/profile/$userId/comments")({
  component: UserCommentsComponent,
});
function UserCommentsComponent() {
  const { userId } = Route.useParams();
  return <UserCommentsList userId={userId} />;
}

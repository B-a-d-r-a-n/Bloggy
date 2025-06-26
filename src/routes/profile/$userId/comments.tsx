import { createFileRoute } from "@tanstack/react-router";
import UserCommentsList from "../../../features/profile/components/UserCommentsList";

export const Route = createFileRoute("/profile/$userId/comments")({
  component: userCommentsComponent,
});
function userCommentsComponent() {
  return <UserCommentsList />;
}

import { createFileRoute } from "@tanstack/react-router";
import UserCommentsList from "../../../features/profile/components/UserCommentsList";
import { useGetUserProfile } from "../../../features/profile/queries";
import { useCurrentUser } from "../../../features/auth/queries";

export const Route = createFileRoute("/profile/$userId/comments")({
  component: UserCommentsComponent,
});

function UserCommentsComponent() {
  const { userId } = Route.useParams();
  const { data: currentUser } = useCurrentUser();
  const { data: profileUser } = useGetUserProfile(userId);

  const isOwnProfile = currentUser?._id === profileUser?._id;

  return (
    <UserCommentsList
      userId={userId}
      isOwnProfile={isOwnProfile}
      userName={profileUser?.name}
    />
  );
}

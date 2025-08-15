import { createFileRoute } from "@tanstack/react-router";
import StarredArticlesList from "../../../features/profile/components/StarredArticlesList";
import { useGetUserProfile } from "../../../features/profile/queries";
import { useCurrentUser } from "../../../features/auth/queries";

export const Route = createFileRoute("/profile/$userId/starred")({
  component: UserArticlesComponent,
});

function UserArticlesComponent() {
  const { userId } = Route.useParams();
  const { data: currentUser } = useCurrentUser();
  const { data: profileUser } = useGetUserProfile(userId);

  const isOwnProfile = currentUser?._id === profileUser?._id;

  return (
    <StarredArticlesList
      userId={userId}
      isOwnProfile={isOwnProfile}
      userName={profileUser?.name}
    />
  );
}

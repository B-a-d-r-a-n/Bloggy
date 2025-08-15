import { createFileRoute } from "@tanstack/react-router";
import ProfileArticleList from "../../../features/profile/components/ProfileArticleList";
import { useGetUserProfile } from "../../../features/profile/queries";
import { useCurrentUser } from "../../../features/auth/queries";

function ProfileIndexPage() {
  const { userId } = Route.useParams();
  const { data: currentUser } = useCurrentUser();
  const { data: profileUser } = useGetUserProfile(userId);
  
  const isOwnProfile = currentUser?._id === profileUser?._id;
  
  return (
    <ProfileArticleList
      authorId={userId}
      authorName={profileUser?.name || "User"}
      isOwnProfile={isOwnProfile}
    />
  );
}

export const Route = createFileRoute("/profile/$userId/")({
  component: ProfileIndexPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { useGetUserProfile } from "../../features/profile/queries";
import ProfileDisplay from "../../features/profile/components/ProfileDisplay";
import ProfileArticleList from "../../features/profile/components/ProfileArticleList";
import { useCurrentUser } from "../../features/auth/queries";

export const Route = createFileRoute("/profile/$userId")({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = Route.useParams();
  const { data: currentUser } = useCurrentUser();
  const { data: profileUser, isLoading, isError } = useGetUserProfile(userId);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  }

  if (isError || !profileUser) {
    return <p className="py-12 text-center text-error">User not found.</p>;
  }

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <ProfileDisplay user={profileUser} isOwnProfile={isOwnProfile} />
      <ProfileArticleList
        isOwnProfile={isOwnProfile}
        authorName={profileUser.name}
        authorId={profileUser._id}
      />
    </div>
  );
}

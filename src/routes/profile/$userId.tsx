import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useGetUserProfile } from "../../features/profile/queries";
import ProfileDisplay from "../../features/profile/components/ProfileDisplay";
import ProfileArticleList from "../../features/profile/components/ProfileArticleList";
import { useCurrentUser } from "../../features/auth/queries";
import { usePageTitle } from "../../hooks/usePageTitle";
import ProfileNav from "../../features/profile/components/ProfileNav";

function ProfilePage() {
  const { userId } = Route.useParams();
  const { data: currentUser } = useCurrentUser();
  const { data: profileUser, isLoading, isError } = useGetUserProfile(userId);

  usePageTitle({
    title: profileUser ? `${profileUser.name}'s Profile` : "Loading Profile",
  });

  if (isLoading)
    return (
      <div className="py-12 text-center">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  if (isError || !profileUser)
    return <p className="py-12 text-center text-error">User not found.</p>;

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="py-12 max-w-4xl mx-auto space-y-12">
      <ProfileDisplay user={profileUser} isOwnProfile={isOwnProfile} />
      {isOwnProfile ? (
        <div>
          <ProfileNav userId={userId} />
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      ) : (
        <ProfileArticleList
          isOwnProfile={isOwnProfile}
          authorId={userId}
          authorName={profileUser.name}
        />
      )}
    </div>
  );
}

export const Route = createFileRoute("/profile/$userId")({
  component: ProfilePage,
});

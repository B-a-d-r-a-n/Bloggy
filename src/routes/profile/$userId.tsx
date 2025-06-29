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

  // --- Determine what content to show based on the viewed user's role ---
  const isAuthor =
    profileUser.role === "author" || profileUser.role === "admin";

  return (
    <div className="py-12 max-w-4xl mx-auto space-y-12">
      <ProfileDisplay user={profileUser} isOwnProfile={isOwnProfile} />

      {/* If the profile belongs to an author, show their articles by default */}
      {isAuthor && (
        <ProfileArticleList
          isOwnProfile={isOwnProfile}
          authorId={profileUser._id}
          authorName={profileUser.name}
        />
      )}

      <div>
        <h3 className="text-2xl font-bold mb-6">User Activity</h3>
        <ProfileNav userId={userId} /> {/* The nav can be shown for any user */}
        <div className="mt-8">
          <Outlet />
        </div>
      </div>

      {/* --- "Apply to be an Author" button --- */}
      {/* fix the apply button and application for author in general */}
      {/* {isOwnProfile &&
        profileUser.role === "reader" &&
        profileUser.authorStatus === "none" && (
          <div className="text-center p-8 bg-base-200 rounded-lg">
            <h3 className="text-xl font-bold">Want to share your story?</h3>
            <p className="my-2">Apply to become an author on Bloggy.</p>
            <button className="btn btn-primary">Apply Now</button>
          </div>
        )}
      {isOwnProfile && profileUser.authorStatus === "pending" && (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <p className="font-semibold">
            Your author application is pending review.
          </p>
        </div>
      )} */}
    </div>
  );
}
export const Route = createFileRoute("/profile/$userId")({
  component: ProfilePage,
});

import { createFileRoute } from "@tanstack/react-router";
import ProfileArticleList from "../../../features/profile/components/ProfileArticleList";

function ProfileIndexPage() {
  const { userId } = Route.useParams();
  return (
    <ProfileArticleList
      authorId={userId}
      authorName="User" // Placeholder name
      isOwnProfile={true} // 100% true because it's a protected route
    />
  );
}

export const Route = createFileRoute("/profile/$userId/")({
  component: ProfileIndexPage,
});

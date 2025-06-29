import { createFileRoute } from "@tanstack/react-router";
import StarredArticlesList from "../../../features/profile/components/StarredArticlesList";

export const Route = createFileRoute("/profile/$userId/starred")({
  component: UserArticlesComponent,
});

function UserArticlesComponent() {
  const { userId } = Route.useParams();
  return (
    <div className="flex items-center justify-center">
      <StarredArticlesList userId={userId} />
    </div>
  );
}

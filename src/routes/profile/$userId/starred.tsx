import { createFileRoute } from "@tanstack/react-router";
import StarredArticlesList from "../../../features/profile/components/StarredArticlesList";

export const Route = createFileRoute("/profile/$userId/starred")({
  component: userArticlesComponent,
});

function userArticlesComponent() {
  return (
    <div className="flex items-center justify-center">
      <StarredArticlesList />
    </div>
  );
}

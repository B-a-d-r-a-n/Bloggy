import { createFileRoute } from "@tanstack/react-router";
import ArticleList from "../../features/articles/components/ArticleList";
export const Route = createFileRoute("/articles/")({
  component: RouteComponent,
});
function RouteComponent() {
  return <ArticleList />;
}
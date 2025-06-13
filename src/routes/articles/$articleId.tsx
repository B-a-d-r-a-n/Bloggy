import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/$articleId")({
  // loader: ({ params }) => fetchArticle(params.articleId), //ToDO: fetchArticle function
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/articles/$articleId"!</div>;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/action")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/articles/(private)/action"!</div>;
}

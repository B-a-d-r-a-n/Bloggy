import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/profile/dashboard"!</div>;
}

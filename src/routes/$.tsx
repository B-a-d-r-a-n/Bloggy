import { createFileRoute } from "@tanstack/react-router";
import NotFound from "../components/ui/NotFound";
import { useRouteTitle } from "../hooks/usePageTitle";
export const Route = createFileRoute("/$")({
  component: NotFoundPage,
});
function NotFoundPage() {
  useRouteTitle("Not Found");
  return <NotFound />;
}

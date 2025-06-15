import { createFileRoute } from "@tanstack/react-router";
const HomePage = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold">Welcome to Our Awesome App!</h1>
      <p className="mt-4">This is the public landing page.</p>
    </div>
  );
};
export const Route = createFileRoute("/")({
  component: HomePage,
});
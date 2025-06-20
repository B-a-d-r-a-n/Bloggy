import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useInfiniteArticles } from "../features/articles/queries";
import ArticleList from "../features/articles/components/ArticleList";
import { SearchFilterFAB } from "../features/articles/components/SearchFilter";
import { ScrollToTopButton } from "../components/ui/ScrollToTopButton";
const homeSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["newest", "oldest", "stars"]).optional(),
});
export const Route = createFileRoute("/")({
  validateSearch: (search) => homeSearchSchema.parse(search),
  component: HomePage,
});
function HomePage() {
  const { q, category, sort } = Route.useSearch();
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles({ q, category, sort });
  return (
    <div className="py-8">
      {}
      <ArticleList
        data={data}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
      {}
      <SearchFilterFAB />
      <ScrollToTopButton />
    </div>
  );
}
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
  // 1. Get the validated search params from the URL.
  const { q, category, sort } = Route.useSearch();

  // 2. Call the data-fetching hook with the filters.
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
      {/* 3. Pass all the data and state down to the dumb component. */}
      <ArticleList
        data={data}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {/* The search FAB lives here, on the page that controls the search state. */}
      <SearchFilterFAB />
      <ScrollToTopButton />
    </div>
  );
}

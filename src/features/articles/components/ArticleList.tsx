import { useEffect, Fragment } from "react";
import ArticleCard from "./ArticleCard";
import { useInView } from "react-intersection-observer";
import EmptyState from "../../../components/ui/EmptyState";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedArticlesResponse } from "../../../core/types/api";
interface ArticleListProps {
  data?: InfiniteData<PaginatedArticlesResponse>;
  isLoading: boolean;
  isError: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}
export default function ArticleList({
  data,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ArticleListProps) {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-y-8">
        <div className="skeleton h-96 w-full max-w-2xl"></div>
        <div className="skeleton h-96 w-full max-w-2xl"></div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-error">Failed to load articles.</div>
    );
  }
  const articles = data?.pages.flatMap((page) => page.data) ?? [];
  if (articles.length === 0) {
    return (
      <div className="mt-16">
        <EmptyState
          icon={<DocumentPlusIcon />}
          title="No Articles Found"
          description="We couldn't find any articles matching your search. Try different keywords or clear the filters."
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-y-8">
      {}
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.data.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} className="h-10 w-full">
        {isFetchingNextPage && (
          <div className="text-center">
            <span className="loading loading-lg loading-spinner"></span>
          </div>
        )}
      </div>
      {!hasNextPage && (
        <p className="text-center text-base-content/60 my-8">
          You've seen it all!
        </p>
      )}
    </div>
  );
}
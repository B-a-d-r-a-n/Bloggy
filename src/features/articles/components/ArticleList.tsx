import React, { useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { useInfiniteArticles } from "../queries"; // <-- Import the new hook
import { useInView } from "react-intersection-observer"; // <-- Import the observer hook
import { useAuth } from "../../../hooks/useAuth";

export default function ArticleList() {
  const { user: currentUser } = useAuth();

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles();

  // The `useInView` hook gives us a `ref` to attach to an element.
  // When that element comes into view, the `inView` boolean becomes true.
  const { ref, inView } = useInView({
    threshold: 0, // Trigger as soon as the element is visible
  });

  // This useEffect will run whenever `inView` becomes true.
  useEffect(() => {
    // If the trigger element is in view and there's a next page to fetch,
    // and we're not already fetching, then fetch the next page.
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    // Initial loading state with skeletons
    return (
      <div className="flex flex-col items-center gap-y-8">
        <div className="skeleton h-96 w-full max-w-2xl"></div>
        <div className="skeleton h-96 w-full max-w-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error">
        Failed to load articles: {error.message}
      </div>
    );
  }

  // Flatten the array of pages into a single array of articles
  const articles = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col items-center gap-y-8">
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}

      {/* --- The Infinite Scroll Trigger --- */}
      {/* This invisible div is our trigger. We attach the `ref` to it. */}
      {/* When this div scrolls into view, the `useEffect` above will fire. */}
      <div ref={ref} className="h-10 w-full">
        {isFetchingNextPage && (
          <div className="text-center">
            <span className="loading loading-lg loading-spinner"></span>
          </div>
        )}
      </div>

      {!hasNextPage && articles.length > 0 && (
        <p className="text-center text-base-content/60 my-8">
          You've reached the end of the road!
        </p>
      )}
    </div>
  );
}

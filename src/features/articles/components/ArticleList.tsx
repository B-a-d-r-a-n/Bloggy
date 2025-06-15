import React, { useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { useInfiniteArticles } from "../queries";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import EmptyState from "../../../components/ui/EmptyState";
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
  const { ref, inView } = useInView({
    threshold: 0,
  });
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
  if (error) {
    return (
      <div className="text-center text-error">
        Failed to load articles: {error.message}
      </div>
    );
  }

  const articles = data?.pages.flatMap((page) => page.data) ?? [];
  if (articles.length === 0) {
    return (
      <div className="mt-16">
        <EmptyState
          icon={<DocumentPlusIcon />}
          title="No Articles Yet"
          description={
            currentUser
              ? "Be the first to share your thoughts! Get started by creating a new article."
              : "It looks a little empty here. Check back soon for new articles!"
          }
          // Conditionally show a "Create Article" button if the user is logged in
          action={
            currentUser && (
              <Link
                to="/articles/action"
                search={{ mode: "create" }}
                className="btn btn-primary"
              >
                Create First Article
              </Link>
            )
          }
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-y-8">
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}

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

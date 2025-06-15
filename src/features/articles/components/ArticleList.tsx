import React from "react";
import ArticleCard from "./ArticleCard";
import { useGetArticles } from "../queries";

export default function ArticleList() {
  // Call the hook to get the data and all its states.
  // This one line replaces all your manual useEffect, useState for loading, data, and error.
  const { data, isLoading, isError, error } = useGetArticles();

  // 1. Handle the loading state
  if (isLoading) {
    // Render skeleton loaders for a great user experience
    return (
      <div className="flex flex-col items-center gap-y-8">
        <div className="skeleton h-96 w-full max-w-2xl"></div>
        <div className="skeleton h-96 w-full max-w-2xl"></div>
        <div className="skeleton h-96 w-full max-w-2xl"></div>
      </div>
    );
  }

  // 2. Handle the error state
  if (isError) {
    return (
      <div role="alert" className="alert alert-error max-w-2xl mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! Failed to load articles: {error.message}</span>
      </div>
    );
  }

  // 3. Handle the success state
  // Safely access the articles array from the paginated response
  const articles = data?.data || [];

  return (
    <div className="flex flex-col items-center gap-y-8">
      {articles.length > 0 ? (
        articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}

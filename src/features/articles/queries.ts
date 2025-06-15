// src/features/articles/queries.ts

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// Import the singleton instance of your service
// Import the types you'll be working with
import articleService from "../../core/services/articleService";
import type { PaginatedArticlesResponse } from "../../core/types/api";
import type {
  ArticleFull,
  // CreateArticlePayload,
  // UpdateArticlePayload,
} from "../../core/types/article";
import { useNavigate } from "@tanstack/react-router";

/**
 * A "key factory" is a best practice for managing query keys.
 * It prevents typos and makes it easy to invalidate queries from anywhere.
 */
// A more intuitively named key factory
export const articleKeys = {
  // Root key for all article-related queries
  all: ["articles"] as const,

  // Key for all queries that return lists of articles
  // Useful for invalidating ALL article lists at once
  // e.g., after creating a new article, you want to refetch every list.
  allLists: () => [...articleKeys.all, "list"] as const,

  // Key for a SPECIFIC list of articles, with specific filters/pagination
  // Example: queryKey: articleKeys.list({ page: 2, sort: 'newest' })
  list: (filters: object) => [...articleKeys.allLists(), filters] as const,

  // Key for all queries that return a single, detailed article
  // Useful for invalidating ALL single article views at once
  allDetails: () => [...articleKeys.all, "detail"] as const,

  // Key for a SPECIFIC detailed article by its ID
  // queryKey: articleKeys.detail('some-article-id')
  detail: (id: string) => [...articleKeys.allDetails(), id] as const,
};
/**
 * This is the custom hook your components will use to get the list of articles.
 */
/**
 * Hook to fetch paginated articles for an infinite scroll list.
 */
export const useInfiniteArticles = () => {
  return useInfiniteQuery({
    queryKey: articleKeys.allLists(), // Use the main list key
    // The query function receives the pageParam from getNextPageParam
    queryFn: ({ pageParam }) => articleService.fetchArticles(pageParam),
    // Start with page 1
    initialPageParam: 1,
    // Determine the next page number to fetch
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined; // Return undefined when there are no more pages
    },
  });
};
export const useGetArticleById = (
  articleId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ArticleFull, Error>({
    queryKey: articleKeys.detail(articleId),
    queryFn: () => articleService.fetchArticleById(articleId), // Assumes this service exists
    ...options,
  });
};
/**
 * A mutation hook for CREATING a new article.
 * It now handles the success redirect internally.
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    // The mutation function now correctly expects a single ArticleFull object
    mutationFn: (formData: FormData): Promise<ArticleFull> =>
      articleService.createNewArticle(formData),

    onSuccess: (newArticle) => {
      // `newArticle` is now the direct object
      console.log("Article created, received data:", newArticle);

      // Invalidate queries as before
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.setQueryData(articleKeys.detail(newArticle._id), newArticle);

      // The redirect logic now works perfectly with `newArticle._id`
      navigate({
        to: "/articles/$articleId",
        params: { articleId: newArticle._id },
        replace: true,
      });
    },

    onError: (error: Error) => {
      console.error("Error creating article:", error);
    },
  });
};

/**
 * A mutation hook for UPDATING an existing article.
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (variables: { articleId: string; formData: FormData }) =>
      articleService.editExistingArticle(
        variables.articleId,
        variables.formData
      ),

    onSuccess: (updatedArticle) => {
      console.log("Article updated successfully:", updatedArticle);

      // Invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      // Setting the data is better than invalidating here, it feels faster
      queryClient.setQueryData(
        articleKeys.detail(updatedArticle._id),
        updatedArticle
      );

      // Navigate to the updated article page
      navigate({
        to: "/articles/$articleId",
        params: { articleId: updatedArticle._id },
        replace: true, // Replace the form page in history
      });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    // The mutation function will receive the article ID to delete.
    mutationFn: (articleId: string) => articleService.deleteArticle(articleId),

    onSuccess: (_, articleId) => {
      // The first arg is the response (void), the second is the variable passed to mutate
      console.log(`Article ${articleId} deleted successfully.`);

      // Invalidate all article lists so the deleted article is removed.
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });

      // Optional: Remove the specific article from the cache immediately.
      queryClient.removeQueries({ queryKey: articleKeys.detail(articleId) });

      // Navigate the user away from the now-deleted article page, perhaps to the main list.
      navigate({ to: "/articles" });
    },
    onError: (error: Error) => {
      console.error("Failed to delete article:", error);
      // You can use a toast notification library to show this error to the user.
      alert(`Error: ${error.message}`);
    },
  });
};

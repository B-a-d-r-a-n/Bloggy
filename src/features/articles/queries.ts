// src/features/articles/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Import the singleton instance of your service
// Import the types you'll be working with
import articleService from "../../core/services/articleService";
import type { PaginatedArticlesResponse } from "../../core/types/api";
import type {
  ArticleFull,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "../../core/types/article";

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
export const useGetArticles = () => {
  return useQuery<PaginatedArticlesResponse, Error>({
    // queryKey: A unique, serializable key for this query.
    // TanStack Query uses this for caching. We use our key factory.
    queryKey: articleKeys.allLists(),

    // queryFn: The function that returns a promise to fetch the data.
    // We simply point it to our service method.
    // TanStack Query will automatically call this function.
    queryFn: articleService.fetchArticles,

    // Optional: Configure caching behavior
    // staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
  });
};
export const useGetArticleById = (articleId: string) => {
  return useQuery<ArticleFull, Error>({
    queryKey: articleKeys.detail(articleId),
    queryFn: () => articleService.fetchArticleById(articleId), // Assumes this service exists
    enabled: !!articleId, // Only run if articleId is a valid string
  });
};
/**
 * A mutation hook for CREATING a new article.
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn is the function that will be called to perform the mutation.
    // It receives the variables you pass to `mutate()`.
    mutationFn: (formData: FormData) =>
      articleService.createNewArticle(formData),

    // onSuccess is a callback that runs after a successful mutation.
    // It's the perfect place to invalidate cached data.
    onSuccess: (data) => {
      console.log("Article created successfully:", data);

      // Invalidate the list of articles so it will be refetched with the new article.
      // This will make your main article list update automatically!
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });

      // You can also pre-populate the cache for the new article's detail view.
      queryClient.setQueryData(articleKeys.detail(data._id), data);
    },

    onError: (error: Error) => {
      // You can handle global error logging here if you want.
      console.error("Error creating article:", error);
    },
  });
};

/**
 * A mutation hook for UPDATING an existing article.
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutation function now needs both the ID and the data.
    mutationFn: (variables: { articleId: string; formData: FormData }) =>
      articleService.editExistingArticle(
        variables.articleId,
        variables.formData
      ),

    onSuccess: (data) => {
      console.log("Article updated successfully:", data);

      // Invalidate both the list of articles and the specific article detail query.
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(data._id) });
    },
  });
};

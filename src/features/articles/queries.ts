// src/features/articles/queries.ts

import { api } from "../../lib/api.ts";
import {
  //   ArticleDetail,
  //   ArticleListItem,
  //   PaginationData,
  type Article,
  type Articles,
} from "./types"; // We'll need to define these types

// First, let's define the shape of the paginated list response

// =================================================================
// 1. QUERY OPTIONS FOR FETCHING A LIST OF ARTICLES (with pagination)
// =================================================================

// Define the shape of the parameters we can pass to this query
interface GetArticlesParams {
  page: number;
  limit?: number; // Optional limit
  sortBy?: "asc" | "desc";
}

// This is a function that builds the query options object.
// We pass our pagination/filter params to it.
export const articlesQueryOptions = (params: GetArticlesParams) => {
  return {
    // The queryKey is crucial. It must be unique for each different set of params.
    // TanStack Query will cache page 1 and page 2 separately.
    queryKey: ["articles", params],

    // The queryFn receives the queryKey as part of its context,
    // which is a handy way to access the params without closures.
    queryFn: async (): Promise<Articles> => {
      console.log(`Fetching articles with params:`, params);

      const response = await api.get<Articles>("/articles", {
        // Axios will automatically convert this to query string: /articles?page=1&limit=8
        params: params,
      });

      // We expect the API to return the full object with pagination and data
      return response.data;
    },
  };
};

// ===============================================================
// 2. QUERY OPTIONS FOR FETCHING A SINGLE ARTICLE'S DETAILS
// ===============================================================

// This function takes just the articleId to build the options.
export const articleDetailQueryOptions = (articleId: string) => {
  return {
    // The queryKey uniquely identifies this specific article.
    queryKey: ["articles", "detail", articleId],

    queryFn: async (): Promise<Article> => {
      console.log(`Fetching article detail for ID:`, articleId);

      const response = await api.get<Article>(`/articles/${articleId}`);

      // We expect the API to return the full, nested ArticleDetail object.
      return response.data;
    },
  };
};

// ===============================================================
// (Example) 3. MUTATION FOR CREATING AN ARTICLE
// ===============================================================
/*
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateArticlePayload } from './types';

const createArticleApi = async (newArticle: CreateArticlePayload): Promise<ArticleDetail> => {
  const response = await api.post('/articles', newArticle);
  return response.data;
}

export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createArticleApi,
    onSuccess: () => {
      // When a new article is created, invalidate all queries that start with ['articles']
      // This will cause the list view to refetch automatically.
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  })
}
*/

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import articleService from "../../core/services/articleService";
import type { PaginatedArticlesResponse } from "../../core/types/api";
import type {
  ArticleFull,
} from "../../core/types/article";
import { useNavigate } from "@tanstack/react-router";
export const articleKeys = {
  all: ["articles"] as const,
  allLists: () => [...articleKeys.all, "list"] as const,
  list: (filters: object) => [...articleKeys.allLists(), filters] as const,
  allDetails: () => [...articleKeys.all, "detail"] as const,
  detail: (id: string) => [...articleKeys.allDetails(), id] as const,
};
export const useInfiniteArticles = () => {
  return useInfiniteQuery({
    queryKey: articleKeys.allLists(), 
    queryFn: ({ pageParam }) => articleService.fetchArticles(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined; 
    },
  });
};
export const useGetArticleById = (
  articleId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ArticleFull, Error>({
    queryKey: articleKeys.detail(articleId),
    queryFn: () => articleService.fetchArticleById(articleId), 
    ...options,
  });
};
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData): Promise<ArticleFull> =>
      articleService.createNewArticle(formData),
    onSuccess: (newArticle) => {
      console.log("Article created, received data:", newArticle);
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.setQueryData(articleKeys.detail(newArticle._id), newArticle);
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
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.setQueryData(
        articleKeys.detail(updatedArticle._id),
        updatedArticle
      );
      navigate({
        to: "/articles/$articleId",
        params: { articleId: updatedArticle._id },
        replace: true, 
      });
    },
  });
};
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (articleId: string) => articleService.deleteArticle(articleId),
    onSuccess: (_, articleId) => {
      console.log(`Article ${articleId} deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.removeQueries({ queryKey: articleKeys.detail(articleId) });
      navigate({ to: "/articles" });
    },
    onError: (error: Error) => {
      console.error("Failed to delete article:", error);
      alert(`Error: ${error.message}`);
    },
  });
};
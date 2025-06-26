import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import articleService from "../../core/services/articleService";
import type { ArticleFull } from "../../core/types/article";
import toast from "react-hot-toast";
import starService from "../../core/services/starService";
import { userKeys } from "../profile/queries";
import { useCurrentUser } from "../auth/queries";

export const articleKeys = {
  all: ["articles"] as const,
  allLists: () => [...articleKeys.all, "list"] as const,
  list: (filters: { q?: string; category?: string }) =>
    [...articleKeys.allLists(), filters] as const,
  allDetails: () => [...articleKeys.all, "detail"] as const,
  detail: (id: string) => [...articleKeys.allDetails(), id] as const,
};
interface ArticleFilters {
  q?: string;
  category?: string;
  author?: string;
  sort?: "newest" | "oldest" | "stars";
}
export const useInfiniteArticles = (filters: ArticleFilters = {}) => {
  return useInfiniteQuery({
    queryKey: articleKeys.list(filters),
    queryFn: ({ pageParam }) =>
      articleService.fetchArticles({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
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
  return useMutation({
    mutationFn: (formData: FormData): Promise<ArticleFull> =>
      articleService.createNewArticle(formData),
    onMutate: () => {
      return toast.loading("Publishing article...");
    },
    onSuccess: (newArticle, _, toastId) => {
      console.log("Article created, received data:", newArticle);
      toast.success("Article published successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.setQueryData(articleKeys.detail(newArticle._id), newArticle);
    },
    onError: (error: Error, _, toastId) => {
      console.error("Error creating article:", error);
      toast.error(`Failed to publish article: ${error.message}`, {
        id: toastId,
        duration: 5000,
      });
    },
  });
};
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { articleId: string; formData: FormData }) =>
      articleService.editExistingArticle(
        variables.articleId,
        variables.formData
      ),
    onMutate: () => {
      return toast.loading("Updating article...");
    },
    onSuccess: (updatedArticle, _, toastId) => {
      console.log("Article updated successfully:", updatedArticle);
      toast.success("Article updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.setQueryData(
        articleKeys.detail(updatedArticle._id),
        updatedArticle
      );
    },
    onError: (error: Error, _, toastId) => {
      console.error("Error updating article:", error);
      toast.error(`Failed to update article: ${error.message}`, {
        id: toastId,
        duration: 5000,
      });
    },
  });
};

export const useToggleStar = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: (articleId: string) => starService.toggleStar(articleId),
    onMutate: async (articleId: string) => {
      if (!currentUser) {
        toast.error("Please log in to star articles");
        return;
      }
      const detailKey = articleKeys.detail(articleId);
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previousArticle = queryClient.getQueryData(detailKey) as
        | ArticleFull
        | undefined;
      if (!previousArticle) return;
      const isCurrentlyStarred = previousArticle.starredBy.includes(
        currentUser._id
      );
      toast.success(isCurrentlyStarred ? "Star removed" : "Star given!", {
        duration: 2000,
      });
      queryClient.setQueryData(detailKey, {
        ...previousArticle,
        starredBy: isCurrentlyStarred
          ? previousArticle.starredBy.filter((id) => id !== currentUser._id)
          : [...previousArticle.starredBy, currentUser._id],
        starsCount: isCurrentlyStarred
          ? previousArticle.starsCount - 1
          : previousArticle.starsCount + 1,
      });
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: userKeys.myStarred() });
      }
      return { previousArticle, isCurrentlyStarred };
    },
    onError: (err, articleId, context) => {
      console.error("Error toggling star:", err);
      if (context?.previousArticle) {
        queryClient.setQueryData(
          articleKeys.detail(articleId),
          context.previousArticle
        );
      }
      toast.error("An Error occured! did you try to star your own article ?", {
        duration: 4000,
      });
    },
    onSettled: (data, error, articleId, context) => {
      const authorId = (
        context as {
          previousArticle: ArticleFull;
          isCurrentlyStarred: boolean;
        }
      )?.previousArticle?.author?._id;
      console.log(data, error);
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(articleId),
      });
      if (authorId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(authorId) });
      }
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
    },
  });
};
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) => articleService.deleteArticle(articleId),
    onMutate: () => {
      return toast.loading("Deleting article...");
    },
    onSuccess: (_, articleId, toastId) => {
      console.log(`Article ${articleId} deleted successfully.`);
      toast.success("Article deleted successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: articleKeys.allLists() });
      queryClient.removeQueries({ queryKey: articleKeys.detail(articleId) });
    },
    onError: (error: Error, _, toastId) => {
      console.error("Failed to delete article:", error);
      toast.error(`Failed to delete article: ${error.message}`, {
        id: toastId,
        duration: 5000,
      });
    },
  });
};

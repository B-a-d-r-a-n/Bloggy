import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import commentService from "../../core/services/commentService";
export const commentKeys = {
  all: (articleId: string) => ["comments", articleId] as const,
  lists: (articleId: string) =>
    [...commentKeys.all(articleId), "list"] as const,
};
export const useGetComments = (articleId: string) => {
  return useInfiniteQuery({
    queryKey: commentKeys.lists(articleId),
    queryFn: ({ pageParam }) =>
      commentService.fetchComments(articleId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });
};
export const usePostComment = (articleId: string) => {
  const queryClient = useQueryClient();
  const listKey = commentKeys.lists(articleId);
  return useMutation({
    mutationFn: (text: string) => commentService.postComment(articleId, text),
    onSuccess: (newCommentResponse) => {
      const newComment = newCommentResponse.data.comment;
      if (!newComment) return;
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
};
export const usePostReply = (articleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { commentId: string; text: string }) =>
      commentService.postReply(variables.commentId, variables.text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
  });
};
export const useUpdateComment = (articleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { commentId: string; text: string }) =>
      commentService.updateComment(variables.commentId, variables.text),
    onSuccess: () => {
      // invalidate and refetch
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
  });
};
export const useDeleteComment = (articleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (commentId) => {
      console.log(`Comment ${commentId} deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
  });
};

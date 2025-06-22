import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
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

      toast.success("Comment posted successfully!");
      queryClient.invalidateQueries({ queryKey: listKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post comment. Please try again.");
    },
  });
};

export const usePostReply = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { commentId: string; text: string }) =>
      commentService.postReply(variables.commentId, variables.text),
    onSuccess: () => {
      toast.success("Reply posted successfully!");
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post reply. Please try again.");
    },
  });
};

export const useUpdateComment = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { commentId: string; text: string }) =>
      commentService.updateComment(variables.commentId, variables.text),
    onSuccess: () => {
      toast.success("Comment updated successfully!");
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update comment. Please try again."
      );
    },
  });
};

export const useDeleteComment = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to delete comment. Please try again."
      );
    },
  });
};

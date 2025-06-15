import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import commentService from "../../core/services/commentService";
import type {
  PopulatedComment,
  AddCommentResponse,
} from "../../core/types/comment";

// The key factory is a great pattern to keep.
export const commentKeys = {
  all: (articleId: string) => ["comments", articleId] as const,
  lists: (articleId: string) =>
    [...commentKeys.all(articleId), "list"] as const,
};

// --- QUERIES ---

/**
 * Hook to fetch paginated comments for an article.
 */
export const useGetComments = (articleId: string) => {
  return useInfiniteQuery({
    queryKey: commentKeys.lists(articleId),
    // --- MODERN v5 SYNTAX ---
    // The query function now receives an object with `pageParam`.
    queryFn: ({ pageParam }) =>
      commentService.fetchComments(articleId, pageParam),
    // `initialPageParam` sets the starting page number.
    initialPageParam: 1,
    // `getNextPageParam` determines the next page number to fetch.
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });
};

// --- MUTATIONS ---

/**
 * Hook to post a new top-level comment.
 */
export const usePostComment = (articleId: string) => {
  const queryClient = useQueryClient();
  const listKey = commentKeys.lists(articleId);

  return useMutation({
    mutationFn: (text: string) => commentService.postComment(articleId, text),
    // We can use `onSuccess` for a simpler cache update instead of optimistic updates for now.
    onSuccess: (newCommentResponse) => {
      const newComment = newCommentResponse.data.comment;
      if (!newComment) return;

      // Invalidate the query to refetch all comments. Simple and reliable.
      queryClient.invalidateQueries({ queryKey: listKey });

      // Or, for a faster UI update without a full refetch, manually add the new comment.
      // queryClient.setQueryData(listKey, (oldData: any) => {
      //   if (!oldData) return oldData;
      //   const firstPage = oldData.pages[0];
      //   const newFirstPage = { ...firstPage, data: [newComment, ...firstPage.data] };
      //   return { ...oldData, pages: [newFirstPage, ...oldData.pages.slice(1)] };
      // });
    },
  });
};

/**
 * Hook to post a reply to an existing comment.
 */
export const usePostReply = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { commentId: string; text: string }) =>
      commentService.postReply(variables.commentId, variables.text),
    onSuccess: () => {
      // The simplest way to show a new reply is to refetch all comments for the article.
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
  });
};

/**
 * Hook to delete a comment or a reply.
 */
export const useDeleteComment = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (deletedData, commentId) => {
      console.log(`Comment ${commentId} deleted successfully.`);
      // After deleting, invalidate the comments list to show the change.
      queryClient.invalidateQueries({ queryKey: commentKeys.lists(articleId) });
    },
  });
};

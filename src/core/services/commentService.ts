import { api } from "../../lib/api";
import type {
  PaginatedCommentsResponse,
  AddCommentResponse,
} from "../types/comment";
class CommentService {
  async fetchComments(
    articleId: string,
    page: number = 1
  ): Promise<PaginatedCommentsResponse> {
    const response = await api.get<PaginatedCommentsResponse>(
      `/api/v1/articles/${articleId}/comments?page=${page}&limit=10`
    );
    return response.data;
  }
  async postComment(
    articleId: string,
    text: string
  ): Promise<AddCommentResponse> {
    const response = await api.post<AddCommentResponse>(
      `/api/v1/articles/${articleId}/comments`,
      { text }
    );
    return response.data;
  }
  async postReply(
    commentId: string,
    text: string
  ): Promise<AddCommentResponse> {
    const response = await api.post<AddCommentResponse>(
      `/api/v1/comments/${commentId}/replies`,
      { text }
    );
    return response.data;
  }
  async deleteComment(commentId: string) {
    console.log(
      "Service is about to call api.delete for commentId:",
      commentId
    );
    await api.delete(`/api/v1/comments/${commentId}`);
    console.log("Service call to api.delete completed.");
  }
}
export default new CommentService();

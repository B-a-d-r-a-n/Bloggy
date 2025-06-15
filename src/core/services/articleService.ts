import { api } from "../../lib/api";
import type { PaginatedArticlesResponse } from "../types/api";
import type {
  ArticleFull,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "../types/article";

class ArticleService {
  async fetchArticles(): Promise<PaginatedArticlesResponse> {
    const response =
      await api.get<PaginatedArticlesResponse>("/api/v1/articles");

    return response.data;
  }
  async fetchArticleById(articleId: string): Promise<ArticleFull> {
    const response = await api.get<ArticleFull>(
      `/api/v1/articles/${articleId}`
    );
    return response.data;
  }
  /**
   * Creates a new article using FormData for file uploads.
   */
  async createNewArticle(formData: FormData): Promise<ArticleFull> {
    // When sending FormData, Axios will automatically set the correct
    // 'Content-Type': 'multipart/form-data' header.
    const response = await api.post<ArticleFull>(`/api/v1/articles`, formData);
    return response.data;
  }

  /**
   * Updates an existing article using FormData.
   */
  async editExistingArticle(
    articleId: string,
    formData: FormData
  ): Promise<ArticleFull> {
    // For updates, the method should typically be PATCH or PUT. Let's use PATCH.
    const response = await api.patch<ArticleFull>(
      `/api/v1/articles/${articleId}`,
      formData
    );
    return response.data;
  }
}

export default new ArticleService();

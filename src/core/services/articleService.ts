import { api } from "../../lib/api";
import type { PaginatedArticlesResponse } from "../types/api";
import type { ArticleFull } from "../types/article";
class ArticleService {
  async fetchArticles(page: number = 1): Promise<PaginatedArticlesResponse> {
    const response = await api.get<PaginatedArticlesResponse>(
      `/api/v1/articles?page=${page}&limit=10`
    );
    return response.data;
  }
  async fetchArticleById(articleId: string): Promise<ArticleFull> {
    const response = await api.get<ArticleFull>(
      `/api/v1/articles/${articleId}`
    );
    return response.data;
  }
  async createNewArticle(formData: FormData) {
    const response = await api.post(
      `/api/v1/articles`,
      formData,
      // --- THIS IS THE FIX ---
      // Explicitly override the headers for THIS request only.
      // Setting Content-Type to `multipart/form-data` tells Axios
      // to let the browser handle setting the correct boundary.
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
  async editExistingArticle(
    articleId: string,
    formData: FormData
  ): Promise<ArticleFull> {
    const response = await api.patch<ArticleFull>(
      `/api/v1/articles/${articleId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
  async deleteArticle(articleId: string): Promise<ArticleFull> {
    const response = await api.delete<ArticleFull>(
      `/api/v1/articles/${articleId}`
    );
    return response.data;
  }
}
export default new ArticleService();

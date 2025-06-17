import { api } from "../../lib/api";
import type { PaginatedArticlesResponse } from "../types/api";
import type { ArticleFull } from "../types/article";
interface FetchArticlesParams {
  q?: string;
  category?: string;
  author?: string;
  page?: number;
  sort?: string;
}

class ArticleService {
  async fetchArticles(
    params: FetchArticlesParams = {}
  ): Promise<PaginatedArticlesResponse> {
    // Create an object to hold only the defined query parameters.
    const queryParams: Record<string, string> = {
      page: String(params.page || 1),
      limit: "10", // Keep a consistent limit
    };

    // Conditionally add other parameters if they exist.

    if (params.q) {
      queryParams.q = params.q;
    }
    if (params.category) {
      queryParams.category = params.category;
    }
    if (params.author) {
      queryParams.author = params.author;
    }
    if (params.sort) {
      let sortValue = "-createdAt";
      if (params.sort === "oldest") sortValue = "createdAt";
      if (params.sort === "stars") sortValue = "-starsCount";
      queryParams.sort = sortValue;
    }

    // Build the query string from the object.
    const queryString = new URLSearchParams(queryParams).toString();

    const response = await api.get<PaginatedArticlesResponse>(
      `/api/v1/articles?${queryString}`
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

import { api } from "../lib/api";
import type { PaginatedArticlesResponse } from "../types/api";

const baseUrl = import.meta.env.VITE_API_URL;
class ArticleService {
  async fetchArticles(): Promise<PaginatedArticlesResponse> {
    const response = await api.get<PaginatedArticlesResponse>(
      `${baseUrl}/articles`
    );

    return response.data;
  }
}

export default new ArticleService();

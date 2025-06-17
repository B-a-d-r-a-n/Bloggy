import { api } from "../../lib/api";

/**
 * The expected shape of the successful response from the backend's
 * POST /api/v1/articles/:articleId/star endpoint.
 */
interface ToggleStarResponse {
  status: "success";
  data: {
    starred: boolean;
    newCount: number;
  };
}

class StarService {
  /**
   * Toggles a star on a specific article for the currently authenticated user.
   * This sends a POST request to the backend. The backend handles all the logic
   * of adding/removing the star and updating counts.
   * @param articleId The ID of the article to star or unstar.
   * @returns A promise that resolves with the new starred status and count.
   */
  async toggleStar(articleId: string): Promise<ToggleStarResponse> {
    const response = await api.post<ToggleStarResponse>(
      `/api/v1/articles/${articleId}/star`
    );

    return response.data;
  }
}

export default new StarService();

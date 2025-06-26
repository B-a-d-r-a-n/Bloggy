import { api } from "../../lib/api";
interface ToggleStarResponse {
  status: "success";
  data: {
    starred: boolean;
    newCount: number;
  };
}
class StarService {
  async toggleStar(articleId: string): Promise<ToggleStarResponse> {
    const response = await api.post<ToggleStarResponse>(
      `/api/v1/articles/${articleId}/star`
    );
    return response.data;
  }
}
export default new StarService();

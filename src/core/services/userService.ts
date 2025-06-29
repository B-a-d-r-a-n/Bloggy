import { api } from "../../lib/api";
import type { ArticleListItem } from "../types/article";
import type { PopulatedComment } from "../types/comment";
import type { User } from "../types/user";

interface UserResponse {
  status: "success";
  data: { user: User };
}

class UserService {
  async getUserById(userId: string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/api/v1/users/${userId}`);
    return response.data;
  }

  async updateProfilePicture(formData: FormData): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(
      `/api/v1/users/me/avatar`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }

  async updateUser(userData: Partial<User>): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(
      `/api/v1/users/me`,
      userData
    );
    return response.data;
  }

  async getUserComments(userId: string): Promise<{
    status: string;
    data: PopulatedComment[];
  }> {
    const response = await api.get<{
      status: string;
      data: PopulatedComment[];
    }>(`/api/v1/users/${userId}/comments`);
    return response.data;
  }

  async getStarredArticles(userId: string): Promise<{
    status: string;
    data: ArticleListItem[];
  }> {
    const response = await api.get<{ status: string; data: ArticleListItem[] }>(
      `/api/v1/users/${userId}/starred`
    );
    return response.data;
  }
}
export default new UserService();

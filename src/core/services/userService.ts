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

  async getUserComments(): Promise<{
    status: string;
    data: PopulatedComment[];
  }> {
    const response = await api.get<{
      status: string;
      data: PopulatedComment[];
    }>("/api/v1/users/me/comments");
    return response.data;
  }

  async getStarredArticles(): Promise<{
    status: string;
    data: ArticleListItem[];
  }> {
    const response = await api.get<{ status: string; data: ArticleListItem[] }>(
      "/api/v1/users/me/starred-articles"
    );
    return response.data;
  }
}
export default new UserService();

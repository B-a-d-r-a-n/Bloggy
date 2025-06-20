import { api } from "../../lib/api";
import type { User } from "../types/user";
interface UserResponse {
  status: "success";
  data: { user: User };
}
class UserService {
  async getUserById(userId: string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/api/v1/user/${userId}`);
    return response.data;
  }
  async updateAvatar(formData: FormData): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(
      `/api/v1/user/me/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}
export default new UserService();
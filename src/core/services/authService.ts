import { api } from "../../lib/api";
import type { AuthResponse } from "../types/api";
import type { User } from "../types/user";
class AuthService {
  async login(loginInfo: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `/api/v1/auth/login`,
      loginInfo
    );
    return response.data;
  }
  async signup(loginInfo: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `/api/v1/auth/register`,
      loginInfo
    );
    return response.data;
  }
  async logout(): Promise<{ status: string; message: string }> {
    const response = await api.post<{ status: string; message: string }>(
      `/api/v1/auth/logout`
    );
    return response.data;
  }
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`/api/v1/auth/refresh-token`);
    return response.data;
  }
  async getUserById(userId: string): Promise<{ status: string; data: User }> {
    const response = await api.post<{ status: string; data: User }>(
      `/api/v1/auth/user/${userId}`
    );
    return response.data;
  }
}
export default new AuthService();
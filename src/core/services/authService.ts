import { api } from "../../lib/api";
import type { AuthResponse } from "../types/api";
import type { User } from "../types/user";

class AuthService {
  async login(loginInfo: any): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/login",
      loginInfo
    );
    return response.data;
  }

  async signup(signupInfo: any): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/register",
      signupInfo
    );
    return response.data;
  }

  async logout() {
    const response = await api.post("/api/v1/auth/logout");
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/v1/auth/refresh-token");
    return response.data;
  }

  async getMe(): Promise<{ status: string; data: { user: User } }> {
    const response = await api.get<{ status: string; data: { user: User } }>(
      "/api/v1/auth/me"
    );
    return response.data;
  }
}

export default new AuthService();

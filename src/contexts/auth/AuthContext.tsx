import { createContext } from "react";
import type { User } from "../../core/types/user"; // Import your types
import authService from "../../core/services/authService"; // Import your service instance

// Define the shape of your context's value
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (loginInfo: Parameters<typeof authService.login>[0]) => Promise<void>;
  signup: (
    signupInfo: Parameters<typeof authService.signup>[0]
  ) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

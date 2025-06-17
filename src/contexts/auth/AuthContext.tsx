// import { createContext } from "react";
// import type { User } from "../../core/types/user";
// import authService from "../../core/services/authService";

// export interface AuthContextType {
//   user: User | null;
//   userId: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (loginInfo: Parameters<typeof authService.login>[0]) => Promise<void>;
//   signup: (
//     signupInfo: Parameters<typeof authService.signup>[0]
//   ) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (newUser: User) => void;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

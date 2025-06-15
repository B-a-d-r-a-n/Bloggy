import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";
// Import the context object from its new dedicated file

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

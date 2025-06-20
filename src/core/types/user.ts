export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
  totalStars?: number;
  createdAt: string;
  updatedAt: string;
}
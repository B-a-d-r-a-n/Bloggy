import type { ArticleFull } from "./article";

export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: "user" | "admin";
  avatarUrl?: string;
  totalStars?: number;
  starredArticles?: { status: string; data: ArticleFull[] };
  createdAt: string;
  updatedAt: string;
}

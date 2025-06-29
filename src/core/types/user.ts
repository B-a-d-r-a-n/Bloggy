import type { ArticleFull } from "./article";

export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: "reader" | "author" | "admin";
  avatarUrl?: string;
  totalStars?: number;
  authorStatus: string;
  authorApplicationMessage: string;
  starredArticles?: { status: string; data: ArticleFull[] };
  createdAt: string;
  updatedAt: string;
}

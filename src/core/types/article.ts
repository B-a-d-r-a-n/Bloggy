import type { User } from "./user";
import type { PopulatedComment } from "./comment";
import type { Category } from "./category";
import type { Tag } from "./tag";
export interface ArticleListItem {
  _id: string;
  title: string;
  summary: string; 
  coverImageUrl?: string; 
  author: Pick<User, "_id" | "name" | "avatarUrl">;
  category: Pick<Category, "_id" | "name">;
  readTimeInMinutes: number; 
  tags?: { _id: string; name: string }[];
  commentCount: number; 
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; 
}
export interface ArticleFull {
  id: string;
  _id: string;
  title: string;
  summary: string;
  content: string; 
  coverImageUrl?: string;
  author: Pick<User, "_id" | "name" | "avatarUrl">;
  category: Category; 
  readTimeInMinutes: number;
  tags?: Tag[]; 
  comments?: PopulatedComment[]; 
  commentCount: number; 
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; 
}
export interface CreateArticlePayload {
  title: string;
  summary: string;
  content: string;
  category: string; 
  tags?: string[]; 
  coverImage?: File; 
}
export type UpdateArticlePayload = Partial<CreateArticlePayload>;
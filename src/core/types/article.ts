// src/types/article.ts
import type { User } from "./user";
import type { PopulatedComment } from "./comment";
import type { Category } from "./category";
import type { Tag } from "./tag";

/**
 * Represents an article as it appears in a list (e.g., on the dashboard).
 * Contains summary data and is optimized for list views.
 */
export interface ArticleListItem {
  _id: string;
  title: string;
  summary: string; // `required: true` in the model
  coverImageUrl?: string; // `required: false` in the model
  // The service layer populates author with specific fields for list view
  author: Pick<User, "_id" | "name" | "avatarUrl">;
  // The service layer populates category with at least the name for list view
  category: Pick<Category, "_id" | "name">;
  readTimeInMinutes: number; // `required: true` in the model
  // In a list view, tags might just be an array of string IDs if not populated
  tags?: { _id: string; name: string }[];
  commentCount: number; // From the Mongoose virtual property
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; // Frontend helper property
}

/**
 * Represents a single, fully-detailed article.
 * Includes full content and deeply populated relational data.
 */
export interface ArticleFull {
  id: string;
  _id: string;
  title: string;
  summary: string;
  content: string; // The full HTML content, present in detail view
  coverImageUrl?: string;
  // The service layer populates author fully or with specific fields
  author: Pick<User, "_id" | "name" | "avatarUrl">;
  category: Category; // Fully populated category object
  readTimeInMinutes: number;
  tags?: Tag[]; // Fully populated tag objects
  comments?: PopulatedComment[]; // Fully populated comments, including replies
  commentCount: number; // From the Mongoose virtual property
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; // Frontend helper property
}

/**
 * The data payload required to create a new article.
 * This is what your `ArticleForm` will manage.
 */
export interface CreateArticlePayload {
  title: string;
  summary: string;
  content: string;
  category: string; // The ID of the category
  tags?: string[]; // Array of tag IDs
  coverImage?: File; // For FormData on the frontend
}

/**
 * The data payload for updating an article. All fields are optional.
 */
export type UpdateArticlePayload = Partial<CreateArticlePayload>;

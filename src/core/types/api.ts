// src/types/api.ts
import type { ArticleListItem } from "./article";
import type { PopulatedComment } from "./comment";

export interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedArticlesResponse {
  pagination: PaginationInfo;
  data: ArticleListItem[];
}

export interface PaginatedCommentsResponse {
  pagination: PaginationInfo;
  data: PopulatedComment[];
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  statusCode?: number;
  errors?: Record<string, string>; // For validation errors
}

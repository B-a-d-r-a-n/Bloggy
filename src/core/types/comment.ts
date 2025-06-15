// src/core/types/comment.ts
import type { User } from "./user";
import type { PaginationInfo } from "./api";

export interface PopulatedComment {
  _id: string;
  text: string;
  author: Pick<User, "_id" | "name" | "avatarUrl">;
  article: string;
  replies?: PopulatedComment[];
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; // A frontend-only property
}

// For the paginated GET request
export interface PaginatedCommentsResponse {
  pagination: PaginationInfo;
  data: PopulatedComment[];
}

// For POSTing a new comment or reply
export interface AddCommentResponse {
  status: string;
  data: {
    comment?: PopulatedComment;
    reply?: PopulatedComment;
  };
}

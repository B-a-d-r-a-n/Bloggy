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
  isOwner?: boolean; 
}
export interface PaginatedCommentsResponse {
  pagination: PaginationInfo;
  data: PopulatedComment[];
}
export interface AddCommentResponse {
  status: string;
  data: {
    comment?: PopulatedComment;
    reply?: PopulatedComment;
  };
}
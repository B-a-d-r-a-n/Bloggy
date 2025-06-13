// src/types/comment.ts
import type { User } from "./user";

/**
 * Represents a fully populated comment, including its author and any nested,
 * populated replies. This is the primary type you'll work with on the frontend.
 */
export interface PopulatedComment {
  _id: string;
  text: string;
  // The service layer populates author with specific fields
  author: Pick<User, "_id" | "name" | "avatarUrl">;
  article: string; // The ID of the parent article
  replies?: PopulatedComment[]; // Replies are also PopulatedComment, creating a recursive structure
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; // This is a helper property the frontend can add after checking against the logged-in user's ID
}

/**
 * Type for the API response when creating/updating a comment.
 */
export interface CommentMutationResponse {
  status: "success";
  data: {
    comment?: PopulatedComment; // For top-level comments or updates
    reply?: PopulatedComment; // For replies
  };
}

/**
 * The data payload required to create a new comment or reply.
 */
export interface CreateCommentPayload {
  text: string;
}

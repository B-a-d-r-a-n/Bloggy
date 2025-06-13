// src/types/user.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin"; // Based on the enum in your schema
  avatarUrl?: string; // `required: false` in the schema
  createdAt: string; // From timestamps: true
  updatedAt: string; // From timestamps: true
}

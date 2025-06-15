export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin"; 
  avatarUrl?: string; 
  createdAt: string; 
  updatedAt: string; 
}
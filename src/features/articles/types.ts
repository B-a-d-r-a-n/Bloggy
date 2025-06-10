export interface Article {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category;
  tags: Category[];
  content: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: Author;
  replies: Reply[];
}

export interface Reply {
  id: string;
  text: string;
  createdAt: string;
  author: Author;
}

export interface Category {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Articles {
  pagination: Pagination;
  data: ArticlesData[];
}

export interface ArticlesData {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  category: Category;
  author: Category;
  commentCount: number;
  coverImageUrl: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

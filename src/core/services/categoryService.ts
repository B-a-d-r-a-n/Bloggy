import { api } from "../../lib/api";
import type { Category } from "../types/category";
interface CategoryListResponse {
  status: "success";
  results: number;
  data: Category[];
}
class CategoryService {
  async fetchCategories(): Promise<CategoryListResponse> {
    const response = await api.get<CategoryListResponse>("/api/v1/categories");
    return response.data;
  }
}
export default new CategoryService();
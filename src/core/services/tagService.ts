import { api } from "../../lib/api";
import type { Tag } from "../types/tag";

interface TagListResponse {
  status: "success";
  results: number;
  data: Tag[];
}
interface CreateTagResponse {
  status: "success";
  data: Tag;
}

class TagService {
  async fetchTags(): Promise<TagListResponse> {
    const response = await api.get<TagListResponse>("/api/v1/tags");
    return response.data;
  }
  async createTag(tagName: string): Promise<CreateTagResponse> {
    const response = await api.post<CreateTagResponse>("/api/v1/tags", {
      name: tagName,
    });
    return response.data;
  }
}

export default new TagService();

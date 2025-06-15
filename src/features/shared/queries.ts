import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService from "../../core/services/categoryService";
import tagService from "../../core/services/tagService";
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};
export const useGetCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoryService.fetchCategories,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60, 
    select: (data) => data.data,
  });
};
export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
};
export const useGetTags = () => {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: tagService.fetchTags,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60, 
    select: (data) => data.data,
  });
};
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagName: string) => tagService.createTag(tagName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
};
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService from "../../core/services/categoryService";
import tagService from "../../core/services/tagService";

// --- Category Hooks ---

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoryService.fetchCategories,
    // This data rarely changes, so cache it for a long time.
    staleTime: 1000 * 60 * 60, // 1 hour

    // --- THIS IS THE FIX ---
    // In v5, `cacheTime` is now `gcTime`. Default is 5 minutes.
    gcTime: 1000 * 60 * 60, // 1 hour

    select: (data) => data.data,
  });
};

// --- Tag Hooks ---

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
};

export const useGetTags = () => {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: tagService.fetchTags,
    staleTime: 1000 * 60 * 60, // 1 hour

    // --- THIS IS THE FIX ---
    gcTime: 1000 * 60 * 60, // 1 hour

    select: (data) => data.data,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagName: string) => tagService.createTag(tagName),
    onSuccess: () => {
      // When a new tag is created, invalidate the list of all tags
      // so the dropdown will be updated with the new option automatically.
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
};

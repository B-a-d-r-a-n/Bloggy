import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  summary: z
    .string()
    .min(20, "Summary must be at least 20 characters long.")
    .max(300, "Summary cannot exceed 300 characters."),
  category: z.string().min(1, "Please select a category."), // Assuming you'll send the category ID
  tags: z.array(z.string()).min(1, "Please select at least one tag."),
  content: z
    .string()
    .min(100, "Article content must be at least 100 characters long."),
  coverImage: z
    .any()
    .refine((files) => files?.length >= 1, "Cover image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

// For edit mode, all fields are optional, and the cover image is not required
export const articleEditSchema = articleSchema.partial().extend({
  coverImage: articleSchema.shape.coverImage.optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

import { z } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const tagSchema = z.object({
  _id: z.string(),
  name: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
const baseArticleFormSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  coverImage: z.any().optional(),
});
export type ArticleFormValues = z.infer<typeof baseArticleFormSchema>;
export const getArticleFormSchema = (mode: "create" | "edit") => {
  return baseArticleFormSchema.superRefine((data, ctx) => {
    if (mode === "create") {
      if (!data.title || data.title.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Title must be at least 5 characters.",
          path: ["title"],
        });
      }
      if (!data.summary || data.summary.length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Summary must be at least 20 characters.",
          path: ["summary"],
        });
      }
      if (!data.category) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a category.",
          path: ["category"],
        });
      }
      if (!data.tags || data.tags.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select at least one tag.",
          path: ["tags"],
        });
      }
      if (!data.content || data.content.length < 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Content must be at least 100 characters.",
          path: ["content"],
        });
      }
      const files = data.coverImage as FileList | undefined;
      if (!files || files.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cover image is required.",
          path: ["coverImage"],
        });
      } else {
        if (files[0].size > MAX_FILE_SIZE)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Max file size is 5MB.",
            path: ["coverImage"],
          });
        if (!ACCEPTED_IMAGE_TYPES.includes(files[0].type))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ".jpg, .jpeg, .png, .webp are accepted.",
            path: ["coverImage"],
          });
      }
    }
    if (mode === "edit") {
      if (data.title && data.title.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Title must be at least 5 characters.",
          path: ["title"],
        });
      }
    }
  });
};
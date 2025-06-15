import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import ArticleForm from "../../features/articles/components/ArticleForm";
import {
  useGetArticleById,
  useCreateArticle,
  useUpdateArticle,
  articleKeys,
} from "../../features/articles/queries";
import articleService from "../../core/services/articleService"; // Make sure path is correct

// Define search params validation using Zod
const articleActionSearchSchema = z
  .object({
    mode: z.enum(["create", "edit"]),
    articleId: z.string().optional(),
  })
  .refine((data) => (data.mode === "edit" ? !!data.articleId : true), {
    message: "Article ID is required for edit mode.",
  });

export const Route = createFileRoute("/articles/action")({
  // This step is still good. It validates the search params on arrival.
  validateSearch: (search) => articleActionSearchSchema.parse(search),

  // Handle loading state for edit mode
  loader: ({ context, search }) => {
    // --- THIS IS THE FIX ---
    // We re-parse the search object using our schema.
    // This provides TypeScript with the correct types for `mode` and `articleId`.
    const { mode, articleId } = articleActionSearchSchema.parse(search);

    if (mode === "edit") {
      // TypeScript now knows that if mode is 'edit', articleId MUST be a string
      // because of our .refine() logic in the schema.
      return context.queryClient.ensureQueryData({
        queryKey: articleKeys.detail(articleId!), // Use the key factory
        queryFn: () => articleService.fetchArticleById(articleId!),
      });
    }
    // It's good practice to return something, even if null, from a loader.
    return null;
  },

  component: ArticleActionPage,
});

function ArticleActionPage() {
  const navigate = useNavigate();
  // The `useSearch` hook will have the correctly typed search params
  // because `validateSearch` has already run and parsed them.
  const { mode, articleId } = Route.useSearch();

  // Get the pre-fetched data using `useLoaderData` for edit mode
  const initialData = Route.useLoaderData();

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const handleSubmit = (formData: FormData) => {
    if (mode === "edit" && articleId) {
      updateMutation.mutate(
        { articleId, formData },
        {
          onSuccess: (data) =>
            navigate({
              to: "/articles/$articleId",
              params: { articleId: data._id },
            }),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) =>
          navigate({
            to: "/articles/$articleId",
            params: { articleId: data._id },
          }),
      });
    }
  };

  return (
    <div className="py-12">
      <ArticleForm
        mode={mode}
        // The type of `initialData` will be correctly inferred from the loader's return type.
        initialData={mode === "edit" ? initialData : undefined}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

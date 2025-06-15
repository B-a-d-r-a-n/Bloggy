import { useState } from "react"; // Import React for useState
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import ArticleForm from "../../features/articles/components/ArticleForm";
import {
  useGetArticleById,
  useCreateArticle,
  useUpdateArticle,
} from "../../features/articles/queries";

const articleActionSearchSchema = z
  .object({
    mode: z.enum(["create", "edit"]).default("create"),
    articleId: z.string().optional(),
  })
  .refine((data) => (data.mode === "edit" ? !!data.articleId : true), {
    message: "Article ID is required for edit mode.",
  });

export const Route = createFileRoute("/articles/action")({
  validateSearch: (search) => articleActionSearchSchema.parse(search),
  component: ArticleActionPage,
});

function ArticleActionPage() {
  const navigate = useNavigate();
  const { mode, articleId } = Route.useSearch();

  // 1. State for handling API errors from mutations
  const [apiError, setApiError] = useState<string | null>(null);

  // The type of `articleId` is narrowed to `string` inside this block
  const isEditMode = mode === "edit" && !!articleId;

  const {
    data: initialData,
    isLoading: isLoadingArticle,
    isError: isArticleError,
  } = useGetArticleById(
    articleId!, // We can pass articleId directly
    { enabled: isEditMode } // `enabled` handles the undefined/null case safely
  );

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const handleSubmit = (formData: FormData) => {
    setApiError(null); // Clear previous errors on a new submission

    if (isEditMode) {
      updateMutation.mutate(
        { articleId, formData },
        {
          onSuccess: (data) => {
            // 2. Robust redirect logic
            const id = data.id || data._id; // Prioritize virtual `id`, fall back to `_id`
            navigate({
              to: "/articles/$articleId",
              params: { articleId: id },
              replace: true,
            });
          },
          // 3. Handle errors from the mutation
          onError: (error) => {
            setApiError(error.message || "Failed to update the article.");
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          // 2. Robust redirect logic
          const id = data.id || data._id;
          navigate({
            to: "/articles/$articleId",
            params: { articleId: id },
            replace: true,
          });
        },
        // 3. Handle errors from the mutation
        onError: (error) => {
          setApiError(error.message || "Failed to publish the article.");
        },
      });
    }
  };

  // 4. Refined loading and error handling for EDIT mode
  if (isEditMode) {
    if (isLoadingArticle) {
      return (
        <div className="py-12 text-center">
          <span className="loading loading-lg loading-spinner"></span>
          <p>Loading article for editing...</p>
        </div>
      );
    }

    if (isArticleError || !initialData) {
      return (
        <div className="py-12">
          <div role="alert" className="alert alert-error max-w-2xl mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Error! Could not load article data. Please check the URL and try
              again.
            </span>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="py-12">
      {/* 5. Display the API error message right above the form */}
      {apiError && (
        <div role="alert" className="alert alert-error max-w-4xl mx-auto mb-6">
          <span>{apiError}</span>
        </div>
      )}
      <ArticleForm
        mode={mode}
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

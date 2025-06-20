import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { z } from "zod";
import ArticleForm from "../../features/articles/components/ArticleForm";
import {
  useCreateArticle,
  useUpdateArticle,
  articleKeys,
} from "../../features/articles/queries";
import { authKeys } from "../../features/auth/queries";
import articleService from "../../core/services/articleService";
import type { ArticleFull } from "../../core/types/article";
const articleActionSearchSchema = z
  .object({
    mode: z.enum(["create", "edit"]),
    articleId: z.string().optional(),
  })
  .refine((data) => (data.mode === "edit" ? !!data.articleId : true), {
    message: "Article ID is required for edit mode.",
  });
export const Route = createFileRoute("/articles/action")({
  validateSearch: (search) => articleActionSearchSchema.parse(search),
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: authKeys.me,
    });
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  loaderDeps: ({ search }) => ({
    mode: search.mode,
    articleId: search.articleId,
  }),
  loader: ({ context, deps }) => {
    if (deps.mode === "edit") {
      return context.queryClient.ensureQueryData({
        queryKey: articleKeys.detail(deps.articleId!),
        queryFn: () => articleService.fetchArticleById(deps.articleId!),
      });
    }
    return null;
  },
  component: ArticleActionPage,
});
function ArticleActionPage() {
  const navigate = useNavigate();
  const { mode, articleId } = Route.useSearch();
  const initialData = Route.useLoaderData() as ArticleFull | null;
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
              replace: true,
            }),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) =>
          navigate({
            to: "/articles/$articleId",
            params: { articleId: data._id },
            replace: true,
          }),
      });
    }
  };
  const { status } = Route.useMatch();
  const isInitialLoading = status === "pending";
  if (isInitialLoading) {
    return (
      <div className="py-12 text-center">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  }
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  return (
    <div className="py-12">
      <ArticleForm
        mode={mode}
        initialData={mode === "edit" ? initialData! : undefined}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
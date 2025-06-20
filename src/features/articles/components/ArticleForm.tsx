import { zodResolver } from "@hookform/resolvers/zod";
import { getArticleFormSchema, type ArticleFormValues } from "../validation";
import {
  useCreateTag,
  useGetCategories,
  useGetTags,
} from "../../shared/queries";
import { FormInput } from "../../../components/ui/FormInput";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import { FormFileInput } from "../../../components/ui/FormFileInput";
import MultiSelectCombobox from "../../../components/ui/MultiSelectCombobox";
import type { ArticleFull } from "../../../core/types/article";
import { useMemo } from "react";
import type { Tag } from "../../../core/types/tag";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Combobox from "../../../components/ui/combobox";
import AdvancedRichTextEditor from "../editor/AdvancedRichTextEditor";
interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: ArticleFull;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}
export default function ArticleForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
}: ArticleFormProps) {
  const isEditMode = mode === "edit";

  // --- HOOKS ---
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategories();
  const { data: tagsData = [], isLoading: isLoadingTags } = useGetTags();
  const createTagMutation = useCreateTag();
  const formSchema = useMemo(() => getArticleFormSchema(mode), [mode]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: isEditMode
      ? {
          title: initialData?.title || "",
          summary: initialData?.summary || "",
          content: initialData?.content || "",
          category: initialData?.category?._id || "",
          tags: initialData?.tags || [],
          coverImage: undefined,
        }
      : {
          title: "",
          summary: "",
          content: "",
          category: "",
          tags: [],
          coverImage: undefined,
        },
  });

  // --- HANDLER FUNCTIONS ---
  const handleCreateTag = async (tagName: string): Promise<Tag | null> => {
    try {
      const response = await createTagMutation.mutateAsync(tagName);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create tag:", error);
      alert(
        `Error: ${error.response?.data?.message || "Could not create tag"}`
      );
      return null;
    }
  };
  const handleFormSubmit: SubmitHandler<ArticleFormValues> = (data) => {
    const formData = new FormData();
    const { tags, coverImage, ...restOfData } = data;

    // Handle tags
    if (tags && tags.length > 0) {
      const tagIds = tags.map((tag) => tag._id);
      formData.append("tags", JSON.stringify(tagIds));
    }

    // Handle cover image
    if (coverImage && coverImage.length > 0) {
      formData.append("coverImage", coverImage[0]);
    }

    // Handle all other fields
    Object.entries(restOfData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });
    onSubmit(formData);
  };
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
    >
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? "Edit Article" : "Create a New Article"}
      </h1>
      <FormInput
        label="Article Title"
        registration={register("title")}
        error={errors.title?.message}
        disabled={isSubmitting}
        description="A catchy and descriptive title for your article."
      />
      <FormTextArea
        label="Summary"
        registration={register("summary")}
        error={errors.summary?.message}
        rows={3}
        disabled={isSubmitting}
        description="A brief, one-paragraph summary that will appear in article lists."
      />
      {}
      <div>
        <label className="block text-sm font-medium text-base-content/90 mb-1.5">
          Category
        </label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Combobox
              placeholder={
                isLoadingCategories ? "Loading..." : "Select a category..."
              }
              options={categories}
              value={categories.find((c) => c._id === field.value) || null}
              onChange={(option) => field.onChange(option?._id || "")}
            />
          )}
        />
        {errors.category && (
          <p className="mt-2 text-sm text-error">{errors.category.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-base-content/90 mb-1.5">
          Tags
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <MultiSelectCombobox
              options={tagsData}
              selected={field.value || []}
              onChange={field.onChange}
              placeholder={
                isLoadingTags ? "Loading tags..." : "Search or create a tag..."
              }
              onCreate={handleCreateTag}
              isCreating={createTagMutation.isPending}
            />
          )}
        />
        {errors.tags && (
          <p className="mt-2 text-sm text-error">{errors.tags.message}</p>
        )}
      </div>
      {}
      <div>
        <Controller
          name="coverImage"
          control={control}
          render={() => (
            <FormFileInput
              control={control}
              name="coverImage"
              label="Cover Image"
              error={errors.coverImage?.message as string}
              accept="image/png, image/jpeg, image/webp"
              disabled={isSubmitting}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-base-content/90 mb-1.5">
          content
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <AdvancedRichTextEditor
              content={field.value || ""}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.content && (
          <p className="mt-2 text-sm text-error">{errors.content.message}</p>
        )}
      </div>
      <div className="pt-4 border-t border-base-300">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
        >
          {isSubmitting && <span className="loading loading-spinner"></span>}
          {isEditMode ? "Save Changes" : "Publish Article"}
        </button>
      </div>
    </form>
  );
}

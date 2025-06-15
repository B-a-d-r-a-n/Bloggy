import React, { useMemo } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ArticleFormValues, getArticleFormSchema } from "../validation";
import type { ArticleFull } from "../../../core/types/article";
import Input from "../../../components/ui/Input";
import RichTextEditor from "./RichTextEditor";
import Combobox from "../../../components/ui/combobox";
import {
  useCreateTag,
  useGetCategories,
  useGetTags,
} from "../../shared/queries";
import MultiSelectCombobox from "../../../components/ui/MultiSelectCombobox";
import type { Tag } from "../../../core/types/tag";

interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: ArticleFull;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

// No need for a separate `FormInputValues` type anymore.
// We'll use the one from our validation file.

export default function ArticleForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
}: ArticleFormProps) {
  const isEditMode = mode === "edit";

  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategories();

  const { data: tagsData = [], isLoading: isLoadingTags } = useGetTags();

  const createTagMutation = useCreateTag();

  // --- THIS IS THE KEY FIX ---
  // We create the schema inside the component based on the mode.
  // `useMemo` ensures the schema is not recreated on every render unless `mode` changes.
  const formSchema = useMemo(() => getArticleFormSchema(mode), [mode]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          title: initialData?.title || "",
          summary: initialData?.summary || "",
          content: initialData?.content || "",
          category: initialData?.category?._id || "",
          tags: initialData?.tags, // This is now correctly Tag[]
        }
      : {
          title: "",
          summary: "",
          content: "",
          category: "",
          tags: [],
        },
  });
  console.log("React Hook Form Errors:", errors);
  // The submit handler can be simplified. No need for `safeParse` anymore
  // because the resolver handles the dynamic validation.
  const handleFormSubmit: SubmitHandler<ArticleFormValues> = (data) => {
    console.log("2. Form: handleFormSubmit called with RHF data:", data);
    const formData = new FormData();

    // This logic is now cleaner as well
    const { tags, ...restOfData } = data;

    if (tags) {
      const tagIds = tags.map((tag) => tag._id);
      formData.append("tags", JSON.stringify(tagIds));
    }

    Object.entries(restOfData).forEach(([key, value]) => {
      if (key === "coverImage" && value && (value as FileList).length > 0) {
        formData.append(key, (value as FileList)[0]);
      } else if (value && key !== "coverImage") {
        // Exclude empty coverImage
        formData.append(key, value as string);
      }
    });

    onSubmit(formData);
  };

  const handleCreateTag = async (tagName: string): Promise<Tag | null> => {
    try {
      const response = await createTagMutation.mutateAsync(tagName);
      return response.data; // Return the new tag object
    } catch (error: any) {
      // Handle case where tag already exists, or other errors
      console.error("Failed to create tag:", error);
      // You could use a toast notification library here to show the error
      alert(
        `Error: ${error.response?.data?.message || "Could not create tag"}`
      );
      return null;
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold">
        {isEditMode ? "Edit Article" : "Create a New Article"}
      </h1>

      <Input
        label="Article Title"
        name="title"
        register={register}
        error={errors.title?.message}
        disabled={isSubmitting}
      />

      <div>
        <label className="label">
          <span className="label-text">Summary</span>
        </label>
        <textarea
          {...register("summary")}
          className={`textarea textarea-bordered w-full ${errors.summary ? "textarea-error" : ""}`}
          rows={3}
        ></textarea>
        {errors.summary && (
          <span className="text-error text-xs mt-1">
            {errors.summary.message}
          </span>
        )}
      </div>

      {/* --- CATEGORY COMBOBOX --- */}
      <div>
        <label className="label">
          <span className="label-text">Category</span>
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
          <span className="text-error text-xs mt-1">
            {errors.category.message}
          </span>
        )}
      </div>
      {/* --- TAGS MULTI-SELECT COMBOBOX --- */}
      <div>
        <label className="label">
          <span className="label-text">Tags</span>
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <MultiSelectCombobox
              // Use the renamed variable for the options
              options={tagsData}
              // --- FIX 2: THE TYPES NOW MATCH ---
              // `field.value` is `Tag[] | undefined`
              // `selected` prop expects `Tag[]`
              // The `|| []` handles the undefined case.
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
        {/* Added a more type-safe way to access the error message */}
        {errors.tags && (
          <span className="text-error text-xs mt-1">{errors.tags.message}</span>
        )}
      </div>

      {/* ... rest of the form ... */}

      <div>
        <label className="label">
          <span className="label-text">Cover Image</span>
        </label>
        <input
          type="file"
          {...register("coverImage")}
          className={`file-input file-input-bordered w-full ${errors.coverImage ? "file-input-error" : ""}`}
        />
        {errors.coverImage && (
          <span className="text-error text-xs mt-1">
            {errors.coverImage.message as string}
          </span>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <Controller
          name="content"
          control={control}
          defaultValue={initialData?.content || ""}
          render={({ field }) => (
            <RichTextEditor content={field.value!} onChange={field.onChange} />
          )}
        />
        {errors.content && (
          <span className="text-error text-xs mt-1">
            {errors.content.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {isEditMode ? "Save Changes" : "Publish Article"}
      </button>
    </form>
  );
}

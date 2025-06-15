import { useMemo } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getArticleFormSchema, type ArticleFormValues } from "../validation";

import {
  useCreateTag,
  useGetCategories,
  useGetTags,
} from "../../shared/queries";

// UI Component Imports
import Input from "../../../components/ui/Input";
import RichTextEditor from "./RichTextEditor";
import MultiSelectCombobox from "../../../components/ui/MultiSelectCombobox";
import type { ArticleFull } from "../../../core/types/article";
import Combobox from "../../../components/ui/combobox";
import type { Tag } from "../../../core/types/tag";

// Define the component's props
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

  // --- 1. HOOKS AT THE TOP ---
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
    defaultValues: isEditMode
      ? {
          title: initialData?.title || "",
          summary: initialData?.summary || "",
          content: initialData?.content || "",
          category: initialData?.category?._id || "",
          tags: initialData?.tags || [],
        }
      : {
          title: "",
          summary: "",
          content: "",
          category: "",
          tags: [],
          coverImage: undefined, // Explicitly set file input default to undefined
        },
  });

  // --- 2. HANDLER FUNCTIONS ---
  const handleCreateTag = async (tagName: string): Promise<Tag | null> => {
    try {
      // The `mutateAsync` promise will resolve with the value from `onSuccess` or throw an error
      const newTagResponse = await createTagMutation.mutateAsync(tagName);
      return newTagResponse.data; // Assuming your service/hook returns the response
    } catch (error) {
      console.error("Failed to create tag:", error);

      return null;
    }
  };
  const handleFormSubmit: SubmitHandler<ArticleFormValues> = (data) => {
    console.log("Form data received from RHF:", data);

    const formData = new FormData();

    // --- THIS IS THE FIX ---

    // 1. Handle the cover image explicitly and first.
    //    The `data.coverImage` from RHF will be a FileList.
    if (data.coverImage && data.coverImage.length > 0) {
      // If a file was selected, append the first file from the list.
      formData.append("coverImage", data.coverImage[0]);
    }

    // 2. Handle tags separately as before.
    if (data.tags && data.tags.length > 0) {
      const tagIds = data.tags.map((tag) => tag._id);
      formData.append("tags", JSON.stringify(tagIds));
    }

    // 3. Loop over the rest of the data keys.
    //    We create a list of keys to exclude to avoid processing them again.
    const excludedKeys = ["tags", "coverImage"];

    for (const key in data) {
      if (excludedKeys.includes(key)) {
        continue; // Skip tags and coverImage as we've already handled them
      }

      // Get the value for the current key
      const value = data[key as keyof ArticleFormValues];

      // Append the value if it's not null/undefined
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }

    // --- For Debugging ---
    console.log("Submitting FormData with the following entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    onSubmit(formData);
  };

  // --- 3. JSX RENDER ---
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
      // Add noValidate to prevent default browser validation, letting RHF/Zod handle it
      noValidate
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
          disabled={isSubmitting}
        ></textarea>
        {errors.summary && (
          <span className="text-error text-xs mt-1">
            {errors.summary.message}
          </span>
        )}
      </div>

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

      <div>
        <label className="label">
          <span className="label-text">Tags</span>
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
          <span className="text-error text-xs mt-1">{errors.tags.message}</span>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Cover Image</span>
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          {...register("coverImage")}
          className={`file-input file-input-bordered w-full ${errors.coverImage ? "file-input-error" : ""}`}
          disabled={isSubmitting}
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
          render={({ field }) => (
            <RichTextEditor
              content={field.value || ""}
              onChange={field.onChange}
            />
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

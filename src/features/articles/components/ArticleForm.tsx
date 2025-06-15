import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  articleSchema,
  articleEditSchema,
  type ArticleFormValues,
} from "../validation";
import type { ArticleFull } from "../../../core/types/article"; // Assuming you have these types
import Input from "../../../components/ui/Input";
import RichTextEditor from "./RichTextEditor";

interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: ArticleFull; // Provide initial data for edit mode
  onSubmit: (data: FormData) => void; // We will submit as FormData
  isSubmitting: boolean;
}

export default function ArticleForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
}: ArticleFormProps) {
  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(isEditMode ? articleEditSchema : articleSchema),
    defaultValues: isEditMode
      ? {
          title: initialData?.title,
          summary: initialData?.summary,
          content: initialData?.content,
          category: initialData?.category?._id,
          tags: initialData?.tags?.map((t) => t._id),
        }
      : {},
  });

  const handleFormSubmit = (data: ArticleFormValues) => {
    // Convert the form data to FormData for file upload
    const formData = new FormData();

    // Use Object.entries to append all data
    Object.entries(data).forEach(([key, value]) => {
      if (key === "coverImage" && value) {
        formData.append(key, value[0]); // Append the file
      } else if (key === "tags" && Array.isArray(value)) {
        // Your backend expects tags as a JSON string with multipart/form-data
        formData.append(key, JSON.stringify(value));
      } else if (value) {
        formData.append(key, value);
      }
    });

    onSubmit(formData);
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

      {/* TODO: Replace with dynamic Category and Tag select components */}
      <Input
        label="Category ID"
        name="category"
        register={register}
        error={errors.category?.message}
        disabled={isSubmitting}
      />
      <Input
        label="Tag IDs (comma separated)"
        name="tags"
        register={register}
        error={errors.tags?.message}
        disabled={isSubmitting}
      />

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
            <RichTextEditor content={field.value} onChange={field.onChange} />
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

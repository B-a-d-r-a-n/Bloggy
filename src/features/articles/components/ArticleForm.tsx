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
          tags: initialData?.tags, 
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
  const handleFormSubmit: SubmitHandler<ArticleFormValues> = (data) => {
    console.log("2. Form: handleFormSubmit called with RHF data:", data);
    const formData = new FormData();
    const { tags, ...restOfData } = data;
    if (tags) {
      const tagIds = tags.map((tag) => tag._id);
      formData.append("tags", JSON.stringify(tagIds));
    }
    Object.entries(restOfData).forEach(([key, value]) => {
      if (key === "coverImage" && value && (value as FileList).length > 0) {
        formData.append(key, (value as FileList)[0]);
      } else if (value && key !== "coverImage") {
        formData.append(key, value as string);
      }
    });
    onSubmit(formData);
  };
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
      {}
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
      {}
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
        {}
        {errors.tags && (
          <span className="text-error text-xs mt-1">{errors.tags.message}</span>
        )}
      </div>
      {}
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
import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  initialText?: string;
}

export default function CommentForm({
  onSubmit,
  isSubmitting,
  submitLabel = "Comment",
  initialText = "",
}: CommentFormProps) {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onSubmit(text);
    setText(""); // Clear form on submit
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        className="textarea textarea-bordered w-full"
        rows={3}
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isSubmitting}
      ></textarea>
      <button
        type="submit"
        className="btn btn-primary self-end"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        {submitLabel}
      </button>
    </form>
  );
}

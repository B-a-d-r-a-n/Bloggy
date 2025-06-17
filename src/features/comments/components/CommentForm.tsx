import React, { useState, useEffect, useRef } from "react";
import { useCurrentUser } from "../../auth/queries";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  initialText?: string;
  onCancel?: () => void;
}

export default function CommentForm({
  onSubmit,
  isSubmitting,
  submitLabel = "Comment",
  initialText = "",
  onCancel,
}: CommentFormProps) {
  const [text, setText] = useState(initialText);
  const { data: user } = useCurrentUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically focus the textarea when the form appears (e.g., for replies/edits)
  useEffect(() => {
    textareaRef.current?.focus();
    // Move cursor to the end of the text for editing
    if (initialText) {
      textareaRef.current?.setSelectionRange(
        initialText.length,
        initialText.length
      );
    }
  }, [initialText]);

  // Auto-resize the textarea as the user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "" || isSubmitting) return;
    onSubmit(text);
    // Only clear text if it's a new comment, not an edit form
    if (!initialText) {
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-start gap-3">
        {/* Show avatar for top-level comment form */}
        {!onCancel && user && (
          <div className="avatar flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full">
              <img
                src={
                  user.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt={user.name}
              />
            </div>
          </div>
        )}

        <div className="w-full">
          <textarea
            ref={textareaRef}
            className="textarea textarea-bordered w-full resize-none overflow-hidden text-base"
            rows={1} // Start with a single row
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting}
          ></textarea>

          <div className="flex justify-end items-center gap-2 mt-2">
            {/* Show Cancel button only for reply/edit forms */}
            {onCancel && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting || text.trim() === ""}
            >
              {isSubmitting && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

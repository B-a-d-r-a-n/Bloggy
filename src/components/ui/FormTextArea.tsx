import React, { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../lib/utils";
interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  description?: string;
}
export function FormTextArea({
  label,
  registration,
  error,
  description,
  ...props
}: FormTextAreaProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-base-content/90 mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={id}
        {...registration}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "textarea textarea-bordered w-full text-base leading-relaxed",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-base-100",
          error ? "textarea-error" : "focus:border-primary-focus"
        )}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : description ? (
        <p className="mt-2 text-sm text-base-content/60">{description}</p>
      ) : null}
    </div>
  );
}
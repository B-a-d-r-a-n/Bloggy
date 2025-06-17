import React, { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  description?: string;
}

export function FormInput({
  label,
  registration,
  error,
  description,
  type = "text",
  ...props
}: FormInputProps) {
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
      <div className="relative">
        <input
          id={id}
          type={type}
          {...registration}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "input input-bordered w-full text-base",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-base-100",
            error ? "input-error pr-10" : "focus:border-primary-focus"
          )}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-error"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
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

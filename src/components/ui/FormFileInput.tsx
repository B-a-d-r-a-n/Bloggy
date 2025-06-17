import { useId } from "react";
import { cn } from "../../lib/utils";
import { FormGroup } from "./FormGroup";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface FormFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  disabled?: boolean;
  accept?: string;
}

export function FormFileInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  disabled,
  accept,
}: FormFileInputProps<T>) {
  const id = useId();

  return (
    <FormGroup>
      <label
        htmlFor={id}
        className="label-text font-medium text-base-content/80"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, name, ref } }) => (
          <input
            id={id}
            type="file"
            accept={accept}
            disabled={disabled}
            ref={ref}
            name={name}
            onBlur={onBlur}
            // The key is to specifically handle the onChange event
            onChange={(e) => {
              // Pass the entire FileList object to React Hook Form's state
              onChange(e.target.files);
            }}
            className={cn(
              "file-input file-input-bordered w-full",
              error && "file-input-error"
            )}
          />
        )}
      />
      {error ? (
        <span className="text-error text-xs">{error}</span>
      ) : (
        <div className="h-4"></div>
      )}
    </FormGroup>
  );
}

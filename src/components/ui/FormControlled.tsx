import React, { useId } from "react";
import { FormGroup } from "./FormGroup";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
interface FormControlledProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  children: (field: {
    onChange: (...event: any[]) => void;
    value: any;
  }) => React.ReactElement;
}
export function FormControlled<T extends FieldValues>({
  control,
  name,
  label,
  error,
  children,
}: FormControlledProps<T>) {
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
        render={({ field }) => children({ ...field })}
      />
      {error ? (
        <span className="text-error text-xs">{error}</span>
      ) : (
        <div className="h-4"></div>
      )}
    </FormGroup>
  );
}
import { type InputHTMLAttributes } from "react";
import type { UseFormRegister } from "react-hook-form";
import { cn } from "../../lib/utils.ts";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
}
export default function Input({
  label,
  name,
  register,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        {...register(name)}
        {...props}
        className={cn(
          "input input-bordered w-full",
          error && "input-error",
          className
        )}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
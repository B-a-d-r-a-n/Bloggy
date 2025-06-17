import type { ReactNode } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

// This component now provides more vertical space between each form field.
export function FormGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}

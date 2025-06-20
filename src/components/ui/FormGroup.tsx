import type { ReactNode } from "@tanstack/react-router";
import { cn } from "../../lib/utils";
export function FormGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}
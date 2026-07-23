import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 rounded-md border border-border bg-surface px-4 text-text-primary",
            "placeholder:text-text-muted disabled:opacity-50",
            "transition duration-fast ease-standard",
            // Tratamento de foco específico do Input (borda + glow), substituindo
            // o anel genérico global — ver DESIGN-SYSTEM.md#input.
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent-violet focus-visible:shadow-glow-violet",
            error && "border-state-danger",
            className,
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-state-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

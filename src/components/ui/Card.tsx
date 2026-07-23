import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Aplica o tratamento de hover (elevação + translação) para cards clicáveis. */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-surface p-6 shadow-md",
        interactive &&
          "transition duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-lg",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

import { buttonVariants } from "./button-variants";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading = false, disabled, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          isLoading && "text-transparent",
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {children}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center text-text-primary">
            <Spinner />
            <span className="sr-only">Carregando</span>
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

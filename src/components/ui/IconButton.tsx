import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-text-secondary",
    "transition duration-fast ease-standard hover:bg-surface hover:text-text-primary",
    "active:scale-[0.95] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
  ],
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Ícones não têm texto visível — o label acessível é obrigatório. */
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonVariants({ size }), className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";

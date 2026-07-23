import { cva } from "class-variance-authority";

/**
 * Variantes separadas do componente Button para preservar o Fast Refresh
 * (um módulo que exporta um componente React só pode exportar componentes)
 * e para que outros elementos "com cara de botão" — como um <a> de CTA —
 * reutilizem os mesmos estilos sem duplicar a definição de variantes.
 */
export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 rounded-md",
    "font-body font-medium transition duration-fast ease-standard",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent-gradient text-text-primary hover:scale-[1.02] hover:shadow-glow-violet active:scale-[0.98]",
        secondary:
          "border border-border-strong bg-transparent text-text-primary hover:bg-surface active:scale-[0.98]",
        ghost:
          "bg-transparent text-text-primary hover:bg-surface active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

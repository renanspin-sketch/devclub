import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionalmente (clsx) e resolve conflitos entre
 * utilitários Tailwind concorrentes (tailwind-merge) — necessário sempre
 * que um componente aceita `className` externo que pode sobrescrever
 * um token do design system (ex.: padding, cor de fundo).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

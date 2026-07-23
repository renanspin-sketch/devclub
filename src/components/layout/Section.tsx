import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./Container";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Remove o Container interno para seções que precisam de conteúdo full-bleed. */
  contained?: boolean;
}

export function Section({ className, contained = true, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-24 md:py-32", className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

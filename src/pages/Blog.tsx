import { Section } from "@/components/layout/Section";

// TODO(Fase D): busca, post em destaque e grid de artigos fictícios. Ver ROADMAP.md.
export function Blog() {
  return (
    <Section id="blog" aria-label="Blog" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Blog
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Artigos em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Esta página vai reunir artigos fictícios sobre temas técnicos — chega na Fase
        D.
      </p>
    </Section>
  );
}

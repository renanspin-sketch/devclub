import { Section } from "@/components/layout/Section";

// TODO(Fase F): grade de formações fictícias, com trilhas e cargas horárias. Ver ROADMAP.md.
export function Formacoes() {
  return (
    <Section id="formacoes" aria-label="Formações" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Formações
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Página em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Esta página vai reunir a grade de formações fictícias do DevClub — chega na
        Fase F.
      </p>
    </Section>
  );
}

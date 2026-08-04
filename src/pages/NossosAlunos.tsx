import { Section } from "@/components/layout/Section";

// TODO(Fase C): depoimentos fictícios, cards com filtros por mídia/profissão
// anterior e paginação. Ver ROADMAP.md.
export function NossosAlunos() {
  return (
    <Section id="nossos-alunos" aria-label="Nossos Alunos" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Nossos Alunos
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Histórias em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Esta página vai reunir depoimentos fictícios de alunos do DevClub — chega na
        Fase C.
      </p>
    </Section>
  );
}

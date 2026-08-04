import { Section } from "@/components/layout/Section";

// TODO(Fase F): trilha avançada fictícia (sem alegação de certificação/reconhecimento
// formal — ver limite de escopo em ROADMAP.md). Ver ROADMAP.md.
export function Mba() {
  return (
    <Section id="mba" aria-label="MBA" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">MBA</span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Página em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Esta página vai reunir a trilha avançada fictícia do DevClub — chega na Fase
        F.
      </p>
    </Section>
  );
}

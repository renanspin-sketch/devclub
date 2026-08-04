import { Section } from "@/components/layout/Section";

// TODO(Fase E): formulário de inscrição e lista de edições fictícias. Ver ROADMAP.md.
export function Newsletter() {
  return (
    <Section id="newsletter" aria-label="Newsletter" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Newsletter
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Edições em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Esta página vai reunir a inscrição e as edições fictícias da newsletter —
        chega na Fase E.
      </p>
    </Section>
  );
}

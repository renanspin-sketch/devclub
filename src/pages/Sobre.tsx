import { Section } from "@/components/layout/Section";

// TODO(Fase F): história do DevClub, missão e time fictício. Ver ROADMAP.md.
export function Sobre() {
  return (
    <Section id="sobre" aria-label="Sobre" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Sobre
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Página em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Esta página vai reunir a história e a missão fictícias do DevClub — chega na
        Fase F.
      </p>
    </Section>
  );
}

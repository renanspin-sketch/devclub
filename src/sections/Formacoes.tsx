import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { learningTracks } from "@/data/tracks";

export function Formacoes() {
  return (
    <Section id="formacoes" aria-label="Formações">
      <Reveal>
        <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
          Trilhas de estudo
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-text-primary">
          Formações completas, do zero ao avançado
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-4 max-w-xl text-text-secondary">
          Trilhas práticas pensadas pra quem quer sair do zero — ou destravar o próximo
          nível.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        {/* Scroll lateral nativo: tabIndex torna o contêiner focável, o que
            permite rolar com as setas do teclado sem precisar de mouse/touch
            (contêineres de overflow sem elementos focáveis dentro ficam
            inacessíveis por teclado por padrão). */}
        <ul
          tabIndex={0}
          aria-label="Lista de trilhas de formação"
          className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:-mx-8 md:px-8"
        >
          {learningTracks.map((track) => (
            <li key={track.slug} className="w-64 flex-none snap-start">
              <Card className="flex h-full flex-col gap-3">
                <Badge variant="accent">Do zero ao avançado</Badge>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {track.title}
                </h3>
                <p className="text-sm text-text-secondary">{track.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

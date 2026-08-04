import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: "10k+", label: "Alunos formados" },
  { value: "95%", label: "Empregabilidade" },
  { value: "4.9/5", label: "Avaliação" },
  { value: "+15k", label: "Alunos com vidas transformadas" },
];

const audience = [
  {
    title: "Para quem quer começar do zero",
    description:
      "Aprenda programação do jeito certo, mesmo sem nenhuma experiência prévia. Você começa pelos fundamentos e evolui passo a passo até estar pronto para o mercado.",
  },
  {
    title: "Para quem quer se especializar",
    description:
      "Aprofunde seus conhecimentos com formações completas em Front-end, Back-end, Full Stack e Mobile, usando as tecnologias mais exigidas pelas empresas.",
  },
  {
    title: "Para quem quer evoluir com IA",
    description:
      "Tenha acesso ao MBA em Inteligência Artificial, com certificações internacionais e reconhecimento pelo MEC, ideal para quem busca diferenciação e crescimento profissional.",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M6 14 14 6M8 6h6v6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-accent-green">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  );
}

export function Sobre() {
  return (
    <Section id="sobre" aria-label="Sobre">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-1 rounded-md border border-accent-violet/40 bg-accent-violet/[0.03] px-4 py-2 font-mono text-sm text-accent-green">
              indicação
              <span
                aria-hidden="true"
                className="inline-block h-[1em] w-[0.5em] animate-blink bg-accent-green align-middle"
              />
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 font-display text-4xl font-bold text-text-primary md:text-5xl">
              Para quem é o <span className="text-accent-green">DevClub?</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-4 max-w-md text-text-secondary">
              Independente do seu nível atual, o DevClub foi criado para quem quer entrar,
              crescer ou se consolidar no mercado de tecnologia.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8">
              <div className="grid grid-cols-2 gap-8">
                <Stat value={stats[0].value} label={stats[0].label} />
                <Stat value={stats[1].value} label={stats[1].label} />
              </div>
              <div className="grid grid-cols-2 gap-8 border-t border-border pt-6">
                <Stat value={stats[2].value} label={stats[2].label} />
                <Stat value={stats[3].value} label={stats[3].label} />
              </div>
            </div>
          </Reveal>
        </div>

        <ul role="list" className="flex flex-col divide-y divide-border">
          {audience.map((item, index) => (
            <li key={item.title} className="py-8 first:pt-0 last:pb-0">
              <Reveal delay={0.1 * index} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-green text-canvas"
                >
                  <ArrowIcon />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-text-secondary">{item.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

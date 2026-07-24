import type { ComponentType } from "react";

import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { communityPillars } from "@/data/community";

function MentorshipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1.1 0-2.1-.2-3-.6L4 20l1.2-4.8C4.4 14.1 4 13.1 4 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.7 8.3 10.5 15.3M16.3 8.3 13.5 15.3M8 7h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InterviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 3.5h9l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 13.5l2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M9.5 14.5 14.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M11 6.5 13 4.5a3.5 3.5 0 0 1 5 5l-2 2M13 17.5l-2 2a3.5 3.5 0 0 1-5-5l2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const icons: Record<string, ComponentType> = {
  mentoria: MentorshipIcon,
  comunidade: CommunityIcon,
  entrevistas: InterviewIcon,
  rede: NetworkIcon,
};

export function Community() {
  return (
    <Section id="comunidade" aria-label="Comunidade">
      <Reveal>
        <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
          Além do código
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-text-primary">
          O que te leva mais longe do que só saber programar
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-4 max-w-xl text-text-secondary">
          Aprender a programar é só parte da jornada — o resto é ter apoio pra chegar até
          o fim dela.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {communityPillars.map((pillar, index) => {
          const Icon = icons[pillar.slug];
          return (
            <Reveal key={pillar.slug} delay={0.25 + index * 0.05} className="h-full">
              <Card className="flex h-full flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-violet/15 text-accent-violet-light">
                  <Icon />
                </span>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text-secondary">{pillar.description}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

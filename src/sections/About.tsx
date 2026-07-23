import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { aboutContent } from "@/data/about";

export function About() {
  return (
    <Section id="sobre" aria-label="Sobre">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
              {aboutContent.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-3 font-display text-3xl font-bold text-text-primary">
              {aboutContent.heading}
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 flex flex-col gap-4 text-text-secondary">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {aboutContent.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-text-muted">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold text-text-primary">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <Card className="font-mono text-sm leading-relaxed text-text-secondary">
            <p className="text-text-muted">{"// about.ts"}</p>
            <p>
              <span className="text-accent-violet">const</span> developer = {"{"}
            </p>
            {aboutContent.codeSnippet.map((line) => (
              <p key={line.key} className="pl-4">
                <span className="text-accent-cyan">{line.key}</span>:{" "}
                <span className="text-state-success">{line.value}</span>,
              </p>
            ))}
            <p>{"};"}</p>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

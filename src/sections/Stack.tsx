import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { stackCategories } from "@/data/stack";

export function Stack() {
  return (
    <Section id="stack" aria-label="Stack ensinada">
      <Reveal>
        <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
          Stack ensinada
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-3 font-display text-3xl font-bold text-text-primary">
          As tecnologias que você vai dominar
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-4 max-w-xl text-text-secondary">
          Da base ao avançado, com as ferramentas que o mercado realmente usa no dia a
          dia.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {stackCategories.map((category, index) => (
          <Reveal key={category.title} delay={0.25 + index * 0.05} className="h-full">
            <Card className="h-full">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {category.title}
              </h3>
              <ul
                className="mt-4 flex flex-wrap gap-2"
                aria-label={`Tecnologias em ${category.title}`}
              >
                {category.items.map((item) => (
                  <li key={item}>
                    <Badge>{item}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

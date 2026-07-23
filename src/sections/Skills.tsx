import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { skillCategories } from "@/data/skills";

export function Skills() {
  return (
    <Section id="skills" aria-label="Skills">
      <Reveal>
        <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
          Caixa de ferramentas
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-3 font-display text-3xl font-bold text-text-primary">Skills</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {skillCategories.map((category, index) => (
          <Reveal key={category.title} delay={0.15 + index * 0.05} className="h-full">
            <Card className="h-full">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {category.title}
              </h3>
              <ul
                className="mt-4 flex flex-wrap gap-2"
                aria-label={`Habilidades em ${category.title}`}
              >
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <Badge>{skill}</Badge>
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

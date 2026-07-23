import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/layout/Section";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card interactive className="flex h-full flex-col gap-4">
      <div>
        <h3 className="font-display text-xl font-semibold text-text-primary">
          {project.title}
        </h3>
        <p className="mt-2 text-text-secondary">{project.description}</p>
      </div>

      <ul
        className="flex flex-wrap gap-2"
        aria-label={`Tecnologias usadas em ${project.title}`}
      >
        {project.stack.map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
      </ul>

      {(project.repoUrl || project.demoUrl) && (
        <div className="mt-auto flex gap-4 pt-2 text-sm font-medium">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-text-secondary transition duration-fast ease-standard hover:text-text-primary"
            >
              Código
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent-cyan transition duration-fast ease-standard hover:text-accent-violet"
            >
              Ver projeto ↗
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

export function Projects() {
  return (
    <Section id="projetos" aria-label="Projetos">
      <Reveal>
        <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
          Trabalho recente
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-3 font-display text-3xl font-bold text-text-primary">Projetos</h2>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.2}>
          <p className="mt-10 text-text-secondary">
            Nenhum projeto publicado ainda — em breve, novidades por aqui.
          </p>
        </Reveal>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={0.15 + index * 0.05} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

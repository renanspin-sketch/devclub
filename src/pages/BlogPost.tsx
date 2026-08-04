import { useParams } from "react-router-dom";

import { Section } from "@/components/layout/Section";

// TODO(Fase D): busca o post fictício pelo slug em mock/posts.ts e renderiza
// o conteúdo completo. Ver ROADMAP.md.
export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Section aria-label="Artigo" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Blog
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Artigo em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        O conteúdo do artigo <code className="font-mono text-text-primary">{slug}</code>{" "}
        chega na Fase D.
      </p>
    </Section>
  );
}

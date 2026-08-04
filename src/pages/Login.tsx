import { Section } from "@/components/layout/Section";

// TODO(Fase F): formulário de login real, integrado à área do aluno. Ver ROADMAP.md.
// Propositalmente sem campos de e-mail/senha aqui: um formulário que parece real
// mas não autentica ninguém é o tipo de padrão enganoso que este projeto evita.
export function Login() {
  return (
    <Section id="login" aria-label="Login" className="min-h-[60vh]">
      <span className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
        Login
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-accent-green">
        Página em construção
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        A área de login real chega na Fase F, integrada à área do aluno.
      </p>
    </Section>
  );
}

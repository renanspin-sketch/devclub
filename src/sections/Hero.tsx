import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section id="hero" aria-label="Apresentação" className="flex min-h-[100dvh] items-center">
      <Container className="flex flex-col items-start gap-6 py-24">
        <Reveal>
          <Badge variant="accent">Disponível para novas oportunidades</Badge>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="max-w-3xl font-display text-4xl font-bold text-text-primary md:text-5xl">
            Construindo interfaces com{" "}
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              precisão e propósito
            </span>
            .
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="max-w-xl text-lg text-text-secondary">
            Sou desenvolvedor front-end focado em produtos rápidos, acessíveis e bem
            arquitetados — do primeiro componente ao deploy.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap gap-4">
            <a href="#projetos" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Ver projetos
            </a>
            <a
              href="#contato"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Entrar em contato
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

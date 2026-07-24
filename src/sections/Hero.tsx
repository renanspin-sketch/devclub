import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Parallax pontual: o glow de fundo se desloca no máximo 40px — ver
  // DESIGN-SYSTEM.md#animação-e-microinterações. Desabilitado (range 0→0)
  // quando o usuário prefere movimento reduzido.
  const glowY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 40]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Apresentação"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <m.div
        aria-hidden="true"
        style={{ y: glowY }}
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent-gradient opacity-20 blur-3xl"
      />

      <Container className="flex flex-col items-start gap-6 py-24">
        <Reveal>
          <Badge variant="accent">Formação + comunidade</Badge>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="max-w-3xl font-display text-4xl font-bold text-text-primary md:text-5xl">
            Do primeiro{" "}
            <code className="font-mono text-accent-cyan">console.log</code> à{" "}
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              primeira contratação
            </span>
            .
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="max-w-xl text-lg text-text-secondary">
            O DevClub é onde desenvolvedores em formação viram profissionais
            contratados — trilhas práticas, projetos reais e uma comunidade que
            empurra você pra frente.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap gap-4">
            <a href="#contato" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Quero fazer parte
            </a>
            <a
              href="#projetos"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Ver projetos
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

import { useMemo } from "react";
import { m, useReducedMotion } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useInView } from "@/hooks/useInView";

const NODES = ["React", "TypeScript", "Node.js", "Tailwind CSS", "Git", "JavaScript"];
const RADIUS = 170;
const STAGGER = 0.22;
const LINE_DURATION = 0.9;

function useOrbitPositions(count: number, radius: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      }),
    [count, radius],
  );
}

/**
 * Capítulo 2 — Build. Tecnologias como nós conectados a um centro. Estilo
 * de movimento pedido pelo usuário a partir de uma referência (gravação de
 * tela de um produto real, `tela.mp4`): órbita decorativa ao redor de um
 * núcleo pulsante, cada nó chega um de cada vez com uma partícula
 * percorrendo a linha até ele. Só a linguagem de movimento vem da
 * referência — os nomes de tecnologia são o mesmo conteúdo original já
 * usado aqui, não os logos/marcas reais que apareciam no vídeo.
 *
 * Cada nó é um wrapper estático (posição via transform simples, translate
 * de centralização + offset orbital compostos numa única string) com um
 * `m.div` filho só pra opacidade/escala — motion e Tailwind não competem
 * pela propriedade `transform` do mesmo elemento, o que quebraria a
 * centralização (motion sobrescreve qualquer transform aplicado via classe).
 */
export function Build() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });
  const positions = useOrbitPositions(NODES.length, RADIUS);

  return (
    <section
      ref={ref}
      id="build"
      aria-label="Capítulo 2: Build"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas/80 px-6 py-24 text-center"
    >
      <m.div style={style} className="flex flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          Capítulo 02 / 06 — Build
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold text-text-primary md:text-4xl">
          Cada tecnologia é uma peça — juntas, viram um sistema.
        </h2>
        <p className="mt-4 max-w-md text-text-secondary">
          Você não aprende ferramentas soltas. Aprende como elas se conectam.
        </p>

        {/* `scale` (não altera o box de layout, só o visual) encolhe o
            diagrama inteiro em viewports estreitos — sem isso, o rótulo
            "TypeScript" (o mais longo, e um dos mais deslocados pro lado)
            ultrapassava a borda da viewport e ficava cortado, porque o
            wrapper de cada nó só centraliza a própria origem (x,y), não o
            badge inteiro, que cresce a partir dali. */}
        <div className="relative mt-16 h-[380px] w-[380px] max-w-full origin-center scale-[0.78] sm:h-[420px] sm:w-[420px] sm:scale-100">
          {/* Brilho suave atrás do núcleo, pulsando continuamente — dá a
              sensação de "energia viva" no centro do sistema. */}
          <m.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gradient opacity-30 blur-2xl"
            animate={
              isInView && !shouldReduceMotion ? { scale: [1, 1.35, 1], opacity: [0.2, 0.4, 0.2] } : {}
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg
            viewBox="-210 -210 420 420"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* gradientUnits="userSpaceOnUse" com coordenadas absolutas do
                  viewBox — o padrão (objectBoundingBox, 0→1 relativo à caixa
                  do próprio elemento) degenera pra linhas com largura ou
                  altura zero (ex.: uma linha perfeitamente vertical), e o
                  SVG simplesmente não pinta nada nesse caso. */}
              <linearGradient
                id="build-gradient"
                gradientUnits="userSpaceOnUse"
                x1="-210"
                y1="-210"
                x2="210"
                y2="210"
              >
                <stop offset="0" stopColor="#7C5CFC" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>

            {/* Anéis decorativos ao redor do núcleo — puramente
                atmosféricos (inspirados no anel orbital da referência),
                não representam nenhum dado. Rotação contínua e bem lenta,
                desligada sob reduced-motion. */}
            <m.ellipse
              cx={0}
              cy={0}
              rx={75}
              ry={30}
              fill="none"
              stroke="#7C5CFC"
              strokeOpacity={0.25}
              strokeWidth={1}
              style={{ transformOrigin: "0px 0px" }}
              initial={{ rotate: 35 }}
              // Keyframe termina em 35+360: o valor final bate exatamente
              // com o inicial, então o loop reinicia sem "pulo" visível.
              animate={isInView && !shouldReduceMotion ? { rotate: [35, 395] } : { rotate: 35 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <m.ellipse
              cx={0}
              cy={0}
              rx={95}
              ry={38}
              fill="none"
              stroke="#22D3EE"
              strokeOpacity={0.18}
              strokeWidth={1}
              style={{ transformOrigin: "0px 0px" }}
              initial={{ rotate: -20 }}
              animate={isInView && !shouldReduceMotion ? { rotate: [-20, -380] } : { rotate: -20 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            />

            {positions.map((pos, i) => (
              // strokeDasharray/Dashoffset em vez de `pathLength` do Framer
              // Motion: em teste manual, `pathLength` não desenhava as linhas
              // perfeitamente verticais (x1 === x2) de forma confiável — a
              // técnica manual é mecânica SVG pura, sem essa dependência.
              <m.line
                key={NODES[i]}
                x1={0}
                y1={0}
                x2={pos.x}
                y2={pos.y}
                stroke="url(#build-gradient)"
                strokeWidth={1.5}
                strokeDasharray={RADIUS}
                initial={{ strokeDashoffset: RADIUS, opacity: 0 }}
                animate={isInView ? { strokeDashoffset: 0, opacity: 0.6 } : {}}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : LINE_DURATION,
                  delay: shouldReduceMotion ? 0 : STAGGER * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}

            {/* Partícula que percorre cada linha do centro até o nó,
                acompanhando o desenho da linha, e depois repete
                periodicamente (com atraso escalonado por nó) — o "pulso de
                energia" da referência, sem ficar em loop constante demais
                a ponto de distrair de quem está lendo o texto ao lado. */}
            {!shouldReduceMotion &&
              positions.map((pos, i) => (
                <m.circle
                  key={`particle-${NODES[i]}`}
                  r={3}
                  fill="#22D3EE"
                  initial={{ cx: 0, cy: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? {
                          cx: [0, pos.x],
                          cy: [0, pos.y],
                          opacity: [0, 1, 1, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: LINE_DURATION,
                    delay: STAGGER * i,
                    repeat: Infinity,
                    repeatDelay: 2.6 + i * 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
          </svg>

          <m.div
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-gradient font-display text-xs font-bold text-text-primary shadow-glow-violet"
            animate={
              isInView && !shouldReduceMotion ? { scale: [1, 1.06, 1] } : {}
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Você
          </m.div>

          {positions.map((pos, i) => (
            <div
              key={NODES[i]}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <m.div
                className="whitespace-nowrap rounded-full border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-text-primary"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.4,
                  delay: shouldReduceMotion ? 0 : STAGGER * i + LINE_DURATION * 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {NODES[i]}
              </m.div>
            </div>
          ))}
        </div>
      </m.div>
    </section>
  );
}

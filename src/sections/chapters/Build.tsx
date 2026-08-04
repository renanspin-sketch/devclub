import { useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

import { useChapterTilt } from "@/hooks/useChapterTilt";
import { useInView } from "@/hooks/useInView";

const NODES = ["React", "TypeScript", "Node.js", "Tailwind CSS", "Git", "JavaScript"];
const RADIUS = 170;
const STAGGER = 0.22;
const LINE_DURATION = 0.9;
// Raio (em unidades do viewBox) em que o mouse passa a "puxar" uma linha.
const LINE_HOVER_RADIUS = 70;
const LINE_PULL_MAX = 14;
// Nós usam a própria caixa (hover local), não coordenadas do SVG — força
// proporcional ao deslocamento do mouse dentro do badge, com teto.
const NODE_MAGNET_STRENGTH = 0.3;
const NODE_MAGNET_MAX = 16;

interface Point {
  x: number;
  y: number;
}

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface ConnectionLineProps {
  to: Point;
  index: number;
  isInView: boolean;
  shouldReduceMotion: boolean | null;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

/**
 * Linha do centro até um nó. Além do desenho de entrada (strokeDasharray),
 * reage à proximidade do mouse com um leve puxão elástico — não é hover
 * literal (a linha tem só 1.5px, alvo pequeno demais pra mirar), é
 * proximidade: o quanto mais perto o mouse passa do meio da linha, mais
 * ela "escorrega" na direção dele, e volta sozinha (mola) quando o mouse
 * se afasta.
 */
function ConnectionLine({ to, index, isInView, shouldReduceMotion, mouseX, mouseY }: ConnectionLineProps) {
  const midX = to.x / 2;
  const midY = to.y / 2;

  const pullX = useTransform([mouseX, mouseY], (latest) => {
    const [mx, my] = latest as [number, number];
    const dist = Math.hypot(mx - midX, my - midY);
    if (dist > LINE_HOVER_RADIUS) return 0;
    const strength = (1 - dist / LINE_HOVER_RADIUS) * LINE_PULL_MAX;
    return dist === 0 ? 0 : ((mx - midX) / dist) * strength;
  });
  const pullY = useTransform([mouseX, mouseY], (latest) => {
    const [mx, my] = latest as [number, number];
    const dist = Math.hypot(mx - midX, my - midY);
    if (dist > LINE_HOVER_RADIUS) return 0;
    const strength = (1 - dist / LINE_HOVER_RADIUS) * LINE_PULL_MAX;
    return dist === 0 ? 0 : ((my - midY) / dist) * strength;
  });
  const springX = useSpring(pullX, { stiffness: 250, damping: 20, mass: 0.4 });
  const springY = useSpring(pullY, { stiffness: 250, damping: 20, mass: 0.4 });

  return (
    // strokeDasharray/Dashoffset em vez de `pathLength` do Framer Motion:
    // em teste manual, `pathLength` não desenhava as linhas perfeitamente
    // verticais (x1 === x2) de forma confiável — a técnica manual é
    // mecânica SVG pura, sem essa dependência.
    <m.line
      x1={0}
      y1={0}
      x2={to.x}
      y2={to.y}
      stroke="url(#build-gradient)"
      strokeWidth={1.5}
      strokeDasharray={RADIUS}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      initial={{ strokeDashoffset: RADIUS, opacity: 0 }}
      animate={isInView ? { strokeDashoffset: 0, opacity: 0.6 } : {}}
      transition={{
        duration: shouldReduceMotion ? 0.01 : LINE_DURATION,
        delay: shouldReduceMotion ? 0 : STAGGER * index,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
}

interface TechNodeProps {
  label: string;
  pos: Point;
  index: number;
  isInView: boolean;
  shouldReduceMotion: boolean | null;
}

/**
 * Badge de tecnologia: efeito vidro (fundo translúcido + `backdrop-blur`),
 * flutuação contínua sutil depois que entra, e um leve "ímã elástico" que
 * segue o mouse enquanto ele está por cima e volta pra posição original
 * (mola) quando sai — em duas camadas de `m.div` porque a flutuação e a
 * resposta ao mouse animam a mesma propriedade (`y`) por caminhos
 * diferentes (keyframes vs. mola contínua) e não podem competir no mesmo
 * elemento.
 */
function TechNode({ label, pos, index, isInView, shouldReduceMotion }: TechNodeProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(clamp(offsetX * NODE_MAGNET_STRENGTH, -NODE_MAGNET_MAX, NODE_MAGNET_MAX));
    y.set(clamp(offsetY * NODE_MAGNET_STRENGTH, -NODE_MAGNET_MAX, NODE_MAGNET_MAX));
  };
  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const entryDelay = STAGGER * index + LINE_DURATION * 0.7;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)` }}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          isInView
            ? shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: [0, -7, 0] }
            : {}
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : {
                opacity: { duration: 0.4, delay: entryDelay, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.4, delay: entryDelay, ease: [0.16, 1, 0.3, 1] },
                y: {
                  duration: 3 + index * 0.3,
                  delay: entryDelay + 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        <m.div
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ x: springX, y: springY }}
          className="whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 font-mono text-xs text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          {label}
        </m.div>
      </m.div>
    </div>
  );
}

/**
 * Capítulo 2 — Build. Tecnologias como nós conectados a um centro. Estilo
 * de movimento pedido pelo usuário a partir de uma referência (gravação de
 * tela de um produto real, `tela.mp4`): órbita decorativa ao redor de um
 * núcleo pulsante, cada nó chega um de cada vez com uma partícula
 * percorrendo a linha até ele — e, no ajuste seguinte, efeito vidro nos
 * elementos, badges flutuantes e um sistema elástico que reage à
 * proximidade do mouse (nós e linhas se deslocam levemente na direção do
 * cursor e voltam sozinhos, com mola). Só a linguagem de movimento vem da
 * referência — os nomes de tecnologia são o mesmo conteúdo original já
 * usado aqui, não os logos/marcas reais que apareciam no vídeo.
 */
export function Build() {
  const shouldReduceMotion = useReducedMotion();
  const { ref, isInView } = useInView<HTMLElement>();
  const { style } = useChapterTilt({ ref });
  const positions = useOrbitPositions(NODES.length, RADIUS);

  const svgRef = useRef<SVGSVGElement>(null);
  // Sentinela "infinito": qualquer linha calcula distância até isso como
  // maior que `LINE_HOVER_RADIUS`, então elas ficam relaxadas por padrão
  // sem precisar de um segundo estado "mouse dentro/fora".
  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);

  const handleSvgPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (shouldReduceMotion) return;
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(ctm.inverse());
    mouseX.set(local.x);
    mouseY.set(local.y);
  };
  const handleSvgPointerLeave = () => {
    mouseX.set(Infinity);
    mouseY.set(Infinity);
  };

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
              sensação de "energia viva" no centro do sistema. Mesmo
              wrapper-separado-do-`m.div` do núcleo logo abaixo: `scale`
              animado descartaria o `-translate-x-1/2 -translate-y-1/2` se
              estivesse no mesmo elemento. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2"
          >
            <m.div
              className="h-28 w-28 rounded-full bg-accent-gradient opacity-30 blur-2xl"
              animate={
                isInView && !shouldReduceMotion ? { scale: [1, 1.35, 1], opacity: [0.2, 0.4, 0.2] } : {}
              }
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <svg
            ref={svgRef}
            viewBox="-210 -210 420 420"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            onPointerMove={handleSvgPointerMove}
            onPointerLeave={handleSvgPointerLeave}
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
              <ConnectionLine
                key={NODES[i]}
                to={pos}
                index={i}
                isInView={isInView}
                shouldReduceMotion={shouldReduceMotion}
                mouseX={mouseX}
                mouseY={mouseY}
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

          {/* Wrapper estático só pra centralizar (classe Tailwind) — o
              `m.div` de dentro anima `scale`, e Framer Motion assume o
              controle inteiro da propriedade `transform` do elemento que
              anima; se o `-translate-x-1/2 -translate-y-1/2` estivesse
              nesse mesmo elemento, ele seria descartado assim que a
              animação começasse, e o núcleo saltaria pra fora do centro
              (mesma armadilha documentada abaixo pros nós orbitais). */}
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2">
            <m.div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 font-display text-xs font-bold text-text-primary shadow-glow-violet backdrop-blur-md"
              style={{
                backgroundImage: "linear-gradient(135deg, rgba(124,92,252,0.55), rgba(34,211,238,0.55))",
              }}
              animate={isInView && !shouldReduceMotion ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              Você
            </m.div>
          </div>

          {positions.map((pos, i) => (
            <TechNode
              key={NODES[i]}
              label={NODES[i]}
              pos={pos}
              index={i}
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </m.div>
    </section>
  );
}

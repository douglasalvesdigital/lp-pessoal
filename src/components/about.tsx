"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  ChartColumnIncreasing,
  CircleCheck,
  CodeXml,
  Download,
  FileText,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { site } from "@/lib/site"
import { Eyebrow } from "@/components/eyebrow"
import { cn } from "@/lib/utils"

/** Camadas da pilha, de cima (problema) para baixo (resultado). */
const layers: { label: string; icon: LucideIcon }[] = [
  { label: "Entender", icon: FileText },
  { label: "Escolher o caminho", icon: CircleCheck },
  { label: "Construir", icon: CodeXml },
  { label: "Entregar", icon: ChartColumnIncreasing },
]

/** Passos do processo; cada um acende a camada de mesmo índice. */
const steps: { title: string; text: string; image: string }[] = [
  {
    title: "Entender",
    text: "Negócio, objetivo e quem vai usar.",
    image: "/processo/01-entender.svg",
  },
  {
    title: "Escolher o caminho",
    text: "A solução certa para o problema.",
    image: "/processo/02-escolher-caminho.svg",
  },
  {
    title: "Construir",
    text: "Código limpo, rápido e fácil de manter.",
    image: "/processo/03-construir.svg",
  },
  {
    title: "Entregar",
    text: "Colocar no ar e acompanhar de perto.",
    image: "/processo/04-entregar.svg",
  },
]

/** Tempo em cada etapa antes de acender a próxima (ms). */
const CYCLE = 2600

export function About() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(1)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || reduceMotion) return
    const id = setTimeout(() => setActive((i) => (i + 1) % steps.length), CYCLE)
    return () => clearTimeout(id)
  }, [active, paused, reduceMotion])

  const focus = (i: number) => {
    setActive(i)
    setPaused(true)
  }

  return (
    <section id="sobre" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Celular: título → ilustração → resto do texto (a coluna de texto
            vira "contents" e cada bloco recebe uma ordem). Desktop: duas colunas. */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
          {/* Texto */}
          <div className="contents lg:block">
            <Reveal className="order-1">
              <Eyebrow>Sobre mim</Eyebrow>
              <h2 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl">
                Antes de escrever código,{" "}
                <span className="text-red-light glow-text-red">
                  eu quero entender o problema.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="order-3">
              <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
                Trabalho do front ao back, sozinho ou junto do time: em agência,
                como freela ou dentro de produto. A IA fica com o trabalho
                repetitivo, e eu fico com o que importa:{" "}
                <span className="text-foreground">pensar bem a solução.</span>
              </p>
              <p className="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
                E você fala direto com quem desenvolve,{" "}
                <span className="text-foreground">do briefing à entrega.</span>
              </p>
            </Reveal>

            <Reveal delay={0.15} className="order-3">
              <blockquote className="border-red-primary mt-8 max-w-xl border-l-2 pl-5 text-lg leading-snug font-medium text-balance">
                Boas soluções não começam pela tecnologia mais complexa, mas
                pela escolha certa para cada problema.
              </blockquote>
            </Reveal>

            <Reveal
              delay={0.2}
              className="order-3 mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "hover:bg-red-light h-11 px-5 text-sm shadow-[0_8px_32px_-10px_rgb(229_9_20/0.7)]",
                )}
              >
                Me conta seu projeto
                <ArrowUpRight className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
              </a>
              {site.resume && (
                <a
                  href={site.resume}
                  download
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "hover:border-foreground/30 h-11 bg-transparent px-5 text-sm",
                  )}
                >
                  <Download />
                  Baixar currículo
                </a>
              )}
            </Reveal>

            <Reveal delay={0.25} className="order-3">
              <p className="text-muted-foreground mt-10 flex items-start gap-2.5 text-sm">
                <GraduationCap className="mt-0.5 size-4 shrink-0" />
                <span>
                  <span className="text-foreground/80">Formação:</span> Análise
                  e Desenvolvimento de Sistemas · Curso de arquitetura de
                  multi-agentes (StartSe)
                </span>
              </p>
            </Reveal>
          </div>

          {/* Pilha 3D */}
          <Reveal delay={0.1} className="order-2 mt-6 lg:mt-0">
            <ProcessStack active={active} onFocus={focus} />
          </Reveal>
        </div>

        {/* Passos: cards ilustrados, sincronizados com a pilha */}
        <Reveal delay={0.15}>
          <ol
            onPointerLeave={() => setPaused(false)}
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          >
            {steps.map((step, i) => {
              const on = i === active
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onPointerEnter={() => focus(i)}
                    onFocus={() => focus(i)}
                    onClick={() => focus(i)}
                    className={cn(
                      "bg-background-secondary/60 flex h-full w-full flex-row items-center overflow-hidden rounded-2xl border text-left sm:flex-col sm:items-stretch backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-500",
                      on
                        ? "border-red-primary/60 -translate-y-1 shadow-[0_20px_50px_-24px_rgb(229_9_20/0.7)]"
                        : "border-border/80 hover:border-foreground/20",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático, sem ganho com next/image */}
                    <img
                      src={step.image}
                      alt=""
                      width={420}
                      height={300}
                      loading="lazy"
                      className={cn(
                        "aspect-[7/5] w-[42%] shrink-0 transition-[opacity,transform] duration-500 sm:w-full",
                        on ? "scale-[1.03] opacity-100" : "opacity-70",
                      )}
                    />
                    <span className="sm:border-border/60 block p-4 pl-1 sm:border-t sm:p-5">
                      <span className="text-red-light font-mono text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-lg font-semibold tracking-tight transition-colors",
                          on ? "text-foreground" : "text-foreground/85",
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-sm leading-snug">
                        {step.text}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Pilha isométrica ---------- */

/** Prancheta da ilustração do processo (px). */
const ARTBOARD = { width: 600, height: 720 }

/** Duração de uma volta completa do ciclo (s): metade em cada arco. */
const CYCLE_FILL = 7.5
/** Tamanho do rastro de luz, em fração do arco. */
const TRAIL = 0.45
/** Camadas do rastro: quanto mais perto da ponta, mais camadas somadas. */
const TAIL_LAYERS = [0.06, 0.12, 0.2, 0.3, 0.45]
const TAIL_OPACITY = 0.38

/** Arcos do ciclo (viewBox 600×720): esquerda desce, direita sobe. */
const CYCLE_PATHS = [
  "M150 150 C 30 230, 20 420, 150 520",
  "M470 600 C 600 520, 610 300, 500 140",
]

/** Distância vertical (em 3D) entre as camadas, em px. */
const GAP = 112

function ProcessStack({
  active,
  onFocus,
}: {
  active: number
  onFocus: (i: number) => void
}) {
  const reduceMotion = useReducedMotion()
  // A ilustração é desenhada numa prancheta fixa de 600×720 e escalada para a
  // largura disponível: pilha, setas e anotações mantêm a mesma proporção em
  // qualquer tela (notebook, tablet, celular).
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / ARTBOARD.width),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={boxRef}
      className="relative mx-auto aspect-[5/6] w-full max-w-[600px] select-none"
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: ARTBOARD.width,
          height: ARTBOARD.height,
          transform: `scale(${scale})`,
        }}
      >
        {/* Brilho de fundo */}
        <div
          aria-hidden
          className="bg-red-dark/40 absolute inset-[20%] rounded-full blur-[90px]"
        />

        {/* Cena: plano isométrico (sem perspectiva), camadas empilhadas em Z */}
        <div className="absolute inset-0 flex scale-[1.12] items-center justify-center">
          <div
            className="relative h-[78px] w-[270px] [transform-style:preserve-3d]"
            style={{
              transform: "translateY(120px) rotateX(46deg) rotateZ(-24deg)",
            }}
          >
            {/* Base */}
            <div
              aria-hidden
              className="border-red-primary/70 absolute -inset-10 rounded-2xl border bg-[#0b0b0d] shadow-[0_0_50px_-6px_rgb(229_9_20/0.75),inset_0_0_30px_-10px_rgb(229_9_20/0.6)]"
              style={{ transform: "translateZ(-34px)" }}
            />
            <div
              aria-hidden
              className="absolute -inset-10 rounded-2xl bg-[#060607]"
              style={{ transform: "translateZ(-46px)" }}
            />

            {layers.map((layer, i) => {
              const Icon = layer.icon
              const on = i === active
              const z = (layers.length - 1 - i) * GAP
              return (
                <motion.button
                  key={layer.label}
                  type="button"
                  onClick={() => onFocus(i)}
                  aria-pressed={on}
                  aria-label={layer.label}
                  initial={false}
                  animate={{ z: z + (on ? 16 : 0) }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                  className="absolute inset-0 [transform-style:preserve-3d]"
                >
                  {/* Espessura: placa de baixo, mais escura */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 rounded-xl transition-colors duration-500",
                      on ? "bg-[#5c0408]" : "bg-[#070708]",
                    )}
                    style={{ transform: "translateZ(-18px)" }}
                  />
                  {/* Topo */}
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center gap-4 rounded-xl border px-6 transition-[background,border-color,box-shadow] duration-500",
                      on
                        ? "border-red-light/80 bg-[linear-gradient(135deg,#ff343b,#c1070f)] shadow-[0_0_40px_-4px_rgb(229_9_20/0.9)]"
                        : "border-white/10 bg-[linear-gradient(135deg,#1d1d21,#111114)] shadow-[0_0_20px_-10px_rgb(0_0_0/1)]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors duration-500",
                        on
                          ? "border-white/40 text-white"
                          : "border-white/15 text-foreground/85",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span
                      className={cn(
                        "text-base font-medium whitespace-nowrap transition-colors duration-500",
                        on ? "text-white" : "text-foreground/85",
                      )}
                    >
                      {layer.label}
                    </span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Ciclo: setas tracejadas com o fluxo correndo e um pulso de luz */}
        <svg
          aria-hidden
          viewBox="0 0 600 720"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <marker
              id="about-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="#FF343B" />
            </marker>
          </defs>
          {/* Tracejado estático; os pontinhos acendem em vermelho, um a um,
            seguindo o sentido do ciclo (esquerda desce, direita sobe) */}
          {CYCLE_PATHS.map((d, i) => (
            <g key={i}>
              {/* Cometa que percorre o arco: várias janelas com a mesma ponta e
                comprimentos diferentes se somam. A ponta fica forte e a cauda
                vai enfraquecendo. Entra e sai pelas pontas do arco, então o
                loop emenda sem salto. */}
              <mask id={`about-fill-${i}`} maskUnits="userSpaceOnUse">
                {TAIL_LAYERS.map((len) => {
                  // Posição da ponta: 0 (início do arco) → 1 + TRAIL (cauda saiu)
                  const at = (head: number) => len - head
                  return (
                    <motion.path
                      key={len}
                      d={d}
                      pathLength={1}
                      fill="none"
                      stroke="white"
                      strokeOpacity={reduceMotion ? 1 : TAIL_OPACITY}
                      strokeWidth="14"
                      strokeDasharray={`${len} 3`}
                      initial={{ strokeDashoffset: reduceMotion ? 0 : at(0) }}
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              strokeDashoffset:
                                i === 0
                                  ? [at(0), at(1 + TRAIL), at(1 + TRAIL)]
                                  : [at(0), at(0), at(1 + TRAIL)],
                            }
                      }
                      transition={{
                        duration: CYCLE_FILL,
                        times: [0, 0.5, 1],
                        ease:
                          i === 0
                            ? ["easeInOut", "linear"]
                            : ["linear", "easeInOut"],
                        repeat: Infinity,
                      }}
                    />
                  )
                })}
              </mask>
              <path
                d={d}
                fill="none"
                stroke="#F5F5F5"
                strokeOpacity="0.35"
                strokeWidth="1.4"
                strokeDasharray="3 8"
                markerEnd="url(#about-arrow)"
              />
              <path
                d={d}
                fill="none"
                stroke="#FF343B"
                strokeWidth="2"
                strokeDasharray="3 8"
                mask={`url(#about-fill-${i})`}
                className="drop-shadow-[0_0_4px_#FF343B]"
              />
            </g>
          ))}
        </svg>
        {/* Anotações presas às pontas dos arcos */}
        <span className="font-hand text-foreground/90 absolute top-[318px] left-[-6px] -rotate-12 text-[40px] leading-none">
          Da ideia
        </span>
        <span className="font-hand text-foreground/90 absolute top-[598px] left-[352px] -rotate-12 text-[40px] leading-none">
          ao resultado
        </span>
      </div>
    </div>
  )
}

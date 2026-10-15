"use client"

import { useRef, useState, type ReactNode } from "react"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { AutomationFlow } from "@/components/automation-flow"
import { cn } from "@/lib/utils"
import { Glow } from "@/components/glow"
import { Reveal } from "@/components/reveal"
import {
  AiVisual,
  WebVisual,
  WordpressVisual,
} from "@/components/specialty-visuals"

import {
  siClaude,
  siCursor,
  siFigma,
  siGithubcopilot,
  siGooglegemini,
  siJavascript,
  siMysql,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostman,
  siReact,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWhatsapp,
  siWordpress,
} from "simple-icons"
import { openaiPath } from "@/components/brand-icons"

/** Ícone (path SVG 24×24) + nome; sem path, vira só texto. */
type StackItem = { title: string; path?: string }

type Specialty = {
  title: string
  text: string
  /** Ferramentas do dia a dia nessa frente (logo + nome). */
  stack: StackItem[]
  /**
   * Recebe se o card é o da vez. O visual começa na primeira chegada e depois
   * só pausa/retoma — nunca é remontado, para não reiniciar quando a rolagem
   * oscila na fronteira entre dois cards.
   */
  visual: (active: boolean) => ReactNode
}

/** Deslocamento de cada card na pilha, em px. */
const STACK_OFFSET = 26
/** Fração da tela que o card precisa subir para virar o da vez. */
const ARRIVE_AT = 0.5
/** Folga, em px, para trocar o card da vez (evita oscilar na fronteira). */
const HYSTERESIS_PX = 60

const specialties: Specialty[] = [
  {
    title: "Desenvolvimento Web",
    text: "Sites, landing pages e aplicações em Next.js e React. Rápidos, acessíveis e fáceis de manter depois que vão para o ar.",
    stack: [
      siNextdotjs,
      siReact,
      siTypescript,
      siTailwindcss,
      siShadcnui,
      siVercel,
      siFigma,
    ],
    visual: (active) => <WebVisual active={active} />,
  },
  {
    title: "WordPress sob medida",
    text: "Temas feitos do zero, ACF bem estruturado e WordPress headless. Quem cuida do conteúdo edita tudo sozinho, sem depender de dev.",
    stack: [siWordpress, siPhp, siJavascript, siMysql, { title: "ACF" }],
    visual: (active) => <WordpressVisual active={active} />,
  },
  {
    title: "Integrações & Automação",
    text: "Ligo o site ao CRM, ao WhatsApp, a APIs e ao n8n para tirar do caminho aquela tarefa repetida que ninguém aguenta mais fazer.",
    stack: [
      siN8n,
      siNodedotjs,
      siSupabase,
      siWhatsapp,
      siPostman,
      { title: "APIs REST" },
    ],
    visual: (active) => (
      <AutomationFlow playing={active} compact className="h-full" />
    ),
  },
  {
    title: "IA na prática",
    text: "Uso IA no meu fluxo para entregar mais rápido, e crio automações e agentes que resolvem problemas reais, não demos bonitas.",
    stack: [
      siClaude,
      { title: "ChatGPT", path: openaiPath },
      siGooglegemini,
      siCursor,
      siGithubcopilot,
    ],
    visual: (active) => <AiVisual active={active} />,
  },
]

export function Specialties() {
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  })

  // Card da vez, pela posição real: cada card fica preso no topo depois de
  // rolar a altura do seu wrapper, então o card i chega em i × essa altura.
  // Ele vira o da vez quando já subiu mais da metade da tela.
  const { scrollY } = useScroll()
  const [current, setCurrent] = useState(-1)
  useMotionValueEvent(scrollY, "change", () => {
    const stack = stackRef.current
    if (!stack) return
    const vh = window.innerHeight
    // Distância de rolagem entre um card e o próximo (altura do wrapper)
    const step =
      (stack.firstElementChild as HTMLElement | null)?.offsetHeight || vh
    const passed = -stack.getBoundingClientRect().top + vh * ARRIVE_AT
    const total = specialties.length
    const raw = passed / step
    const next = raw < 0 ? -1 : Math.min(total - 1, Math.floor(raw))
    setCurrent((prev) => {
      if (next === prev) return prev
      // Histerese: só troca depois de passar a fronteira com folga, para
      // pequenos ajustes de rolagem (trackpad, inércia) não ficarem alternando
      const boundary = Math.max(next, prev) * step
      return Math.abs(passed - boundary) > HYSTERESIS_PX ? next : prev
    })
  })

  return (
    <section id="especialidades" className="relative pt-24 lg:pt-32">
      {/* Atravessa a divisa com Projetos: sem linha de corte entre as seções */}
      <Glow className="-bottom-80 -left-64" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-muted-foreground text-sm tracking-[0.12em]">
            especialidades
          </p>
          <h2 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            Como posso ajudar
          </h2>
          <p className="text-muted-foreground mt-5 text-lg text-balance">
            Você traz o problema.{" "}
            <span className="text-foreground">
              Eu escolho a ferramenta certa e resolvo.
            </span>
          </p>
        </Reveal>
      </div>

      {/* Cada card fica preso no topo e o próximo sobe por cima */}
      <div ref={stackRef} className="relative">
        {specialties.map((item, i) => (
          <StackCard
            key={item.title}
            item={item}
            index={i}
            total={specialties.length}
            progress={scrollYProgress}
            active={i === current}
          />
        ))}
      </div>
    </section>
  )
}

function StackCard({
  item,
  index,
  total,
  progress,
  active,
}: {
  item: Specialty
  index: number
  total: number
  progress: MotionValue<number>
  active: boolean
}) {
  // Quanto mais cards vierem depois, mais este encolhe e escurece
  const start = index / total
  const targetScale = 1 - (total - 1 - index) * 0.05
  const scale = useTransform(progress, [start, 1], [1, targetScale])
  const dim = useTransform(
    progress,
    [start, 1],
    [0, (total - 1 - index) * 0.18],
  )

  return (
    <div
      className={cn(
        "sticky top-0 pt-12 lg:pt-20",
        // No celular os cards são baixos (sem o visual): menos rolagem entre eles.
        // O último não tem ninguém para cobri-lo: só ocupa o próprio tamanho.
        index === total - 1 ? "" : "h-[72svh] lg:h-svh",
      )}
      // O deslocamento da pilha (top) não ocupa espaço: o último card o
      // compensa embaixo, para não avançar sobre a seção seguinte
      style={
        index === total - 1
          ? { paddingBottom: index * STACK_OFFSET }
          : undefined
      }
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <motion.article
          style={{ scale, top: index * STACK_OFFSET }}
          className="border-border bg-background-secondary relative origin-top overflow-hidden rounded-3xl border shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9)]"
        >
          {/* Reflexo vermelho no canto, alternando o lado */}
          <div
            aria-hidden
            className={cn(
              "bg-red-dark/20 pointer-events-none absolute size-72 rounded-full blur-[100px] lg:bg-red-dark/45 lg:size-[28rem] lg:blur-[120px]",
              index % 2 === 0
                ? "-top-32 -left-24 lg:-top-56 lg:-left-40"
                : "-right-24 -bottom-32 lg:-right-40 lg:-bottom-56",
            )}
          />

          <div className="relative grid gap-10 p-8 sm:p-10 lg:h-[540px] lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col">
              <span className="text-red-light font-mono text-sm">
                {String(index + 1).padStart(2, "0")}
                <span className="text-muted-foreground/60">
                  {" "}
                  / {String(total).padStart(2, "0")}
                </span>
              </span>
              <h3 className="mt-6 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-5 max-w-md text-base leading-relaxed sm:text-lg">
                {item.text}
              </p>
              {/* Grade de ferramentas: ocupa o espaço livre na base do card */}
              <ul className="mt-auto grid grid-cols-4 gap-1.5 pt-6 sm:gap-2 sm:pt-8">
                {item.stack.map((tool) => (
                  <li
                    key={tool.title}
                    className="group/tool border-border/80 bg-background/40 hover:border-foreground/20 hover:bg-background/70 flex flex-col items-center justify-center gap-2 rounded-xl border px-1 py-3 text-center transition-colors sm:gap-2.5 sm:px-2 sm:py-4 lg:py-5"
                  >
                    {tool.path ? (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden
                        className="text-foreground/70 group-hover/tool:text-foreground size-6 fill-current transition-colors sm:size-7 lg:size-8"
                      >
                        <path d={tool.path} />
                      </svg>
                    ) : (
                      <span
                        aria-hidden
                        className="text-foreground/70 group-hover/tool:text-foreground flex h-6 items-center font-mono text-sm font-semibold transition-colors sm:h-7 lg:h-8"
                      >
                        {"{ }"}
                      </span>
                    )}
                    <span className="text-muted-foreground group-hover/tool:text-foreground text-[10px] leading-tight transition-colors sm:text-xs">
                      {tool.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden min-h-0 lg:block">{item.visual(active)}</div>
          </div>

          {/* Escurece conforme os próximos cards cobrem este */}
          <motion.div
            aria-hidden
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 bg-black"
          />
        </motion.article>
      </div>
    </div>
  )
}

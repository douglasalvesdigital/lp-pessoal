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

type Specialty = {
  title: string
  text: string
  tags: string[]
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
    text: "Construção de sites, landing pages e aplicações web modernas, com atenção à arquitetura, desempenho, acessibilidade e manutenção.",
    tags: ["Next.js", "React", "TypeScript", "Performance", "Acessibilidade"],
    visual: (active) => <WebVisual active={active} />,
  },
  {
    title: "WordPress & Soluções Customizadas",
    text: "Desenvolvimento de temas, funcionalidades sob medida, estruturas com ACF e soluções integradas a sistemas externos.",
    tags: ["Temas sob medida", "ACF", "PHP", "Headless", "Integrações"],
    visual: (active) => <WordpressVisual active={active} />,
  },
  {
    title: "Integrações & Automação",
    text: "Conexão entre plataformas, APIs e fluxos de trabalho para reduzir tarefas manuais e melhorar a eficiência operacional.",
    tags: ["APIs REST", "Webhooks", "n8n", "CRM", "WhatsApp"],
    visual: (active) => (
      <AutomationFlow playing={active} compact className="h-full" />
    ),
  },
  {
    title: "Inteligência Artificial Aplicada",
    text: "Utilização de IA no processo de desenvolvimento e na criação de soluções práticas para problemas do dia a dia.",
    tags: ["Claude", "Agentes", "Automação com IA", "Dev assistido"],
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
            O que eu faço
          </h2>
          <p className="text-muted-foreground mt-5 text-lg text-balance">
            Tecnologia é ferramenta.{" "}
            <span className="text-foreground">
              Resolver problemas é o objetivo.
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
        index === total - 1 ? "" : "h-[62svh] lg:h-svh",
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
              "bg-red-dark/45 pointer-events-none absolute size-[28rem] rounded-full blur-[120px]",
              index % 2 === 0 ? "-top-56 -left-40" : "-right-40 -bottom-56",
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
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border-border text-foreground/75 rounded-full border px-3 py-1 text-xs"
                  >
                    {tag}
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

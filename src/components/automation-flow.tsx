"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  BrainCircuit,
  CircleCheck,
  LoaderCircle,
  SquareKanban,
  UserPlus,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import { siWhatsapp } from "simple-icons"
import { cn } from "@/lib/utils"

/* ---------- Etapas do fluxo ---------- */

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("fill-current", className)}
    >
      <path d={siWhatsapp.path} />
    </svg>
  )
}

type Step = {
  title: string
  idle: string
  done: string
  icon: LucideIcon | typeof WhatsappIcon
}

const steps: Step[] = [
  {
    title: "Novo lead",
    idle: "Formulário do site",
    done: "Maria Souza · maria@empresa.com",
    icon: UserPlus,
  },
  {
    title: "IA classifica",
    idle: "Analisa perfil e intenção",
    done: "Lead quente · score 92",
    icon: BrainCircuit,
  },
  {
    title: "CRM",
    idle: "Cria negócio no pipeline",
    done: "Negócio #4821 · Proposta",
    icon: SquareKanban,
  },
  {
    title: "WhatsApp",
    idle: "Envia boas-vindas",
    done: "Mensagem entregue ✓✓",
    icon: WhatsappIcon,
  },
]

/* ---------- Linha do tempo da execução ---------- */

type Event =
  | { type: "run"; step: number }
  | { type: "travel"; step: number }
  | { type: "done" }
  | { type: "reset" }

const TIMELINE: Event[] = [
  ...steps.flatMap((_, i): Event[] =>
    i < steps.length - 1
      ? [
          { type: "run", step: i },
          { type: "travel", step: i },
        ]
      : [{ type: "run", step: i }],
  ),
  { type: "done" },
  { type: "reset" },
]

const DURATION: Record<Event["type"], number> = {
  run: 1100,
  travel: 650,
  done: 2800,
  reset: 600,
}

type Status = "idle" | "running" | "done"

function statusOf(event: Event, i: number): Status {
  switch (event.type) {
    case "run":
      return i < event.step ? "done" : i === event.step ? "running" : "idle"
    case "travel":
      return i <= event.step ? "done" : "idle"
    case "done":
      return "done"
    case "reset":
      return "idle"
  }
}

/** Conexão i liga a etapa i à i+1. */
function edgeOf(event: Event, i: number): "none" | "travel" | "done" {
  switch (event.type) {
    case "run":
      return i < event.step ? "done" : "none"
    case "travel":
      return i < event.step ? "done" : i === event.step ? "travel" : "none"
    case "done":
      return "done"
    case "reset":
      return "none"
  }
}

/* ---------- Layout (calculado a partir da largura real) ---------- */

const SIZES = {
  default: { cardH: 72, gapY: 46 },
  compact: { cardH: 64, gapY: 30 },
}

function layout(width: number, compact = false) {
  const { cardH: CARD_H, gapY: GAP_Y } = SIZES[compact ? "compact" : "default"]
  const cardW = Math.min(320, Math.max(220, width * 0.64))
  const stepX = (width - cardW) / (steps.length - 1)
  const cards = steps.map((_, i) => ({
    x: i * stepX,
    y: i * (CARD_H + GAP_Y),
  }))
  const edges = cards.slice(0, -1).map((a, i) => {
    const b = cards[i + 1]
    const x1 = a.x + 36
    const y1 = a.y + CARD_H
    const x2 = b.x + 36
    const y2 = b.y
    const mid = (y1 + y2) / 2
    return {
      d: `M ${x1} ${y1} C ${x1} ${mid + 6}, ${x2} ${mid - 6}, ${x2} ${y2}`,
      from: { x: x1, y: y1 },
      to: { x: x2, y: y2 },
    }
  })
  const height = steps.length * CARD_H + (steps.length - 1) * GAP_Y
  return { cardW, cardH: CARD_H, cards, edges, height }
}

/* ---------- Componente ---------- */

export function AutomationFlow({
  className,
  compact = false,
  playing = true,
}: {
  className?: string
  /** Quando false, pausa a execução no estado em que está (ex.: fora da vez). */
  playing?: boolean
  /** Cards e espaçamentos menores, para caber em painéis. */
  compact?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  const [execution, setExecution] = useState(1284)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Parado (fora da vez), congela no estado atual; ao montar, começa do zero
  const event = TIMELINE[tick]

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => {
      const next = (tick + 1) % TIMELINE.length
      if (next === 0) setExecution((n) => n + 1)
      setTick(next)
    }, DURATION[event.type])
    return () => clearTimeout(id)
  }, [tick, event.type, playing])

  const geo = layout(width ?? 560, compact)
  const running = event.type === "run" || event.type === "travel"
  const current =
    event.type === "run" || event.type === "travel" ? event.step + 1 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: width ? 1 : 0, y: width ? 0 : 24 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className={cn(
        "border-border/70 bg-background-secondary/60 relative w-full rounded-2xl border p-5 backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {/* Brilho vermelho atrás do painel */}
      <div
        aria-hidden
        className="bg-red-dark/25 absolute inset-[10%] -z-10 rounded-full blur-3xl"
      />

      {/* Cabeçalho do workflow */}
      <div
        className={cn(
          "border-border/70 flex items-center justify-between gap-4 border-b",
          compact ? "mb-5 pb-3" : "mb-6 pb-4",
        )}
      >
        <div className="flex items-center gap-2.5">
          <Workflow className="text-red-light size-4" />
          <span className="text-sm font-medium">Captação de leads</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs tabular-nums">
          <span className="relative flex size-2">
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full opacity-75",
                running ? "bg-red-light animate-ping" : "bg-emerald-400",
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                running ? "bg-red-primary" : "bg-emerald-400",
              )}
            />
          </span>
          <span className="hidden sm:inline">Execução #{execution} ·</span>
          <span>
            {running
              ? `Executando ${current}/${steps.length}`
              : event.type === "done"
                ? "Concluído em 1,8s"
                : "Aguardando"}
          </span>
        </div>
      </div>

      {/* Canvas do fluxo */}
      <div ref={ref} className="relative w-full" style={{ height: geo.height }}>
        <svg
          aria-hidden
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${width ?? 560} ${geo.height}`}
        >
          {geo.edges.map((edge, i) => {
            const state = edgeOf(event, i)
            return (
              <g key={i}>
                <path
                  d={edge.d}
                  fill="none"
                  stroke="#242428"
                  strokeWidth="1.5"
                />
                {/* Progresso que fica marcado após a passagem */}
                <motion.path
                  d={edge.d}
                  fill="none"
                  stroke="#E50914"
                  strokeWidth="1.5"
                  strokeOpacity="0.55"
                  initial={false}
                  animate={{
                    pathLength: state === "none" ? 0 : 1,
                    opacity: state === "none" ? 0 : 1,
                  }}
                  transition={{
                    duration: state === "travel" ? DURATION.travel / 1000 : 0.4,
                    ease: "easeInOut",
                  }}
                />
                {/* Luz correndo pela conexão */}
                {state === "travel" && !reduceMotion && (
                  <motion.path
                    d={edge.d}
                    fill="none"
                    stroke="#FF343B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_#FF343B]"
                    initial={{ pathLength: 0.25, pathOffset: 0, opacity: 1 }}
                    animate={{ pathOffset: 1, opacity: [1, 1, 0] }}
                    transition={{
                      duration: DURATION.travel / 1000,
                      ease: "easeInOut",
                    }}
                  />
                )}
                {/* Conectores (handles) */}
                {[edge.from, edge.to].map((p, k) => (
                  <circle
                    key={k}
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill="#0B0B0D"
                    stroke={state === "none" ? "#3a3a40" : "#E50914"}
                    strokeWidth="1.5"
                    className="transition-[stroke] duration-300"
                  />
                ))}
              </g>
            )
          })}
        </svg>

        {steps.map((step, i) => (
          <FlowCard
            key={step.title}
            step={step}
            status={statusOf(event, i)}
            style={{
              left: geo.cards[i].x,
              top: geo.cards[i].y,
              width: geo.cardW,
              height: geo.cardH,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function FlowCard({
  step,
  status,
  style,
}: {
  step: Step
  status: Status
  style: CSSProperties
}) {
  const Icon = step.icon
  return (
    <motion.div
      style={style}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-background-secondary absolute flex items-center gap-3 rounded-xl border px-3.5 transition-[border-color,box-shadow] duration-300",
        status === "running"
          ? "border-red-primary/70 shadow-[0_0_28px_-6px_rgb(229_9_20/0.6)]"
          : "border-border hover:border-foreground/20",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
          status === "idle"
            ? "border-border bg-surface text-muted-foreground"
            : "border-red-primary/40 bg-red-deep/60 text-red-light",
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight font-medium">{step.title}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={status === "done" ? "done" : "idle"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "mt-1 truncate text-xs",
              status === "done"
                ? "text-foreground/80"
                : "text-muted-foreground",
            )}
          >
            {status === "done" ? step.done : step.idle}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex size-5 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {status === "running" && (
            <motion.span
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoaderCircle className="text-red-light size-5 animate-spin" />
            </motion.span>
          )}
          {status === "done" && (
            <motion.span
              key="done"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <CircleCheck className="size-5 text-emerald-400" />
            </motion.span>
          )}
          {status === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-border block size-3 rounded-full border-2"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

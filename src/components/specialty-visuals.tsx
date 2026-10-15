"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { animate, motion, useReducedMotion } from "motion/react"
import { siWordpress } from "simple-icons"
import { cn } from "@/lib/utils"

/* ---------- Moldura de janela compartilhada ---------- */

function Window({
  title,
  icon,
  children,
  className,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-border bg-background/80 flex h-full flex-col overflow-hidden rounded-2xl border",
        className,
      )}
    >
      <div className="border-border/80 flex items-center gap-3 border-b px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
          {icon}
          {title}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

/* ---------- 01 · Desenvolvimento Web: notas de qualidade ---------- */

const scores = ["Performance", "Acessibilidade", "Boas práticas", "SEO"]

function ScoreRing({
  label,
  delay,
  active,
}: {
  label: string
  delay: number
  active: boolean
}) {
  const [value, setValue] = useState(0)
  const R = 26
  const C = 2 * Math.PI * R

  // Começa quando o card chega e termina mesmo se ele sair da vez no meio
  const started = useRef(false)
  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    animate(0, 100, {
      duration: 1.4,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    })
  }, [active, delay])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-16">
        <svg viewBox="0 0 64 64" className="size-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="rgb(52 211 153 / 0.15)"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - value / 100)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-emerald-400 tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-muted-foreground text-center text-[11px] leading-tight">
        {label}
      </span>
    </div>
  )
}

export function WebVisual({ active }: { active: boolean }) {
  return (
    <Window title="jed.tec · Lighthouse">
      <div className="flex h-full flex-col justify-between gap-6 p-6">
        <div className="grid grid-cols-4 gap-2">
          {scores.map((label, i) => (
            <ScoreRing
              key={label}
              label={label}
              delay={0.2 + 0.15 * i}
              active={active}
            />
          ))}
        </div>

        {/* Esqueleto de página */}
        <div className="border-border/70 space-y-3 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="bg-red-primary/80 h-2 w-14 rounded-full" />
            <div className="flex gap-2">
              <div className="h-2 w-8 rounded-full bg-white/10" />
              <div className="h-2 w-8 rounded-full bg-white/10" />
              <div className="h-2 w-8 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="h-3 w-3/4 rounded-full bg-white/15" />
          <div className="h-3 w-1/2 rounded-full bg-white/10" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-border/70 bg-surface/60 h-14 rounded-lg border"
              />
            ))}
          </div>
        </div>

        <div className="text-muted-foreground flex items-center justify-between font-mono text-xs">
          <span>LCP 0,8s · CLS 0 · TBT 0ms</span>
          <span className="text-emerald-400">● aprovado</span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 02 · WordPress: código com ACF ---------- */

const k = "text-red-light" // palavras-chave
const f = "text-[#f5c2c4]" // funções
const s = "text-emerald-300/90" // strings
const c = "text-muted-foreground/60" // comentários

const code: ReactNode[] = [
  <span key="1" className={c}>
    {"<?php // single-servico.php"}
  </span>,
  <>
    <span className={k}>$hero</span> = <span className={f}>get_field</span>(
    <span className={s}>&apos;hero&apos;</span>);
  </>,
  <>
    <span className={k}>$cases</span> = <span className={f}>get_field</span>(
    <span className={s}>&apos;cases_relacionados&apos;</span>);
  </>,
  <span key="4" className={c}>
    ?&gt;
  </span>,
  "",
  <>
    &lt;<span className={k}>section</span> class=
    <span className={s}>&quot;hero&quot;</span>&gt;
  </>,
  <>
    {"  "}&lt;<span className={k}>h1</span>&gt;&lt;?={" "}
    <span className={f}>esc_html</span>(<span className={k}>$hero</span>[
    <span className={s}>&apos;titulo&apos;</span>]) ?&gt;&lt;/
    <span className={k}>h1</span>&gt;
  </>,
  <>
    {"  "}&lt;?php <span className={k}>foreach</span> (
    <span className={k}>$cases</span> <span className={k}>as</span>{" "}
    <span className={k}>$case</span>) : ?&gt;
  </>,
  <>
    {"    "}&lt;?php <span className={f}>get_template_part</span>(
    <span className={s}>&apos;parts/card&apos;</span>,{" "}
    <span className={k}>null</span>, [
    <span className={s}>&apos;post&apos;</span> =&gt;{" "}
    <span className={k}>$case</span>]); ?&gt;
  </>,
  <>
    {"  "}&lt;?php <span className={k}>endforeach</span>; ?&gt;
  </>,
  <>
    &lt;/<span className={k}>section</span>&gt;
  </>,
]

export function WordpressVisual({ active }: { active: boolean }) {
  return (
    <Window
      title="single-servico.php"
      icon={
        <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 fill-current">
          <path d={siWordpress.path} />
        </svg>
      }
    >
      <div className="flex h-full flex-col">
        <pre className="flex-1 overflow-hidden p-5 font-mono text-[12.5px] leading-6">
          {/* As linhas são "escritas" em sequência quando o card chega */}
          {code.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={active ? { opacity: 1, x: 0 } : undefined}
              transition={{
                duration: 0.35,
                delay: 0.2 + i * 0.09,
                ease: "easeOut",
              }}
              className="flex gap-4 whitespace-pre"
            >
              <span className="text-muted-foreground/40 w-5 shrink-0 text-right select-none">
                {i + 1}
              </span>
              <span className="text-foreground/85">{line}</span>
            </motion.div>
          ))}
        </pre>
        <div className="border-border/80 text-muted-foreground flex flex-wrap gap-2 border-t px-5 py-3 font-mono text-[11px]">
          {["ACF", "Custom Post Types", "REST API", "Headless"].map((tag) => (
            <span
              key={tag}
              className="border-border rounded-md border px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Window>
  )
}

/* ---------- 04 · IA aplicada: terminal ---------- */

type Line = { text: string; tone?: "prompt" | "info" | "ok" | "dim" }

const session: Line[] = [
  {
    text: '$ claude "criar seção de especialidades com cards empilhados"',
    tone: "prompt",
  },
  { text: "● Lendo design system: tokens, componentes, padrões", tone: "info" },
  { text: "● Planejando estrutura e acessibilidade", tone: "info" },
  { text: "● Gerando components/specialties.tsx", tone: "info" },
  { text: "✓ Tipagem ok · lint ok · build ok", tone: "ok" },
  {
    text: "✓ Revisado por um dev de verdade, pronto para produção",
    tone: "ok",
  },
  { text: "  2m14s · antes: ~1 dia", tone: "dim" },
]

const toneClass: Record<NonNullable<Line["tone"]>, string> = {
  prompt: "text-foreground",
  info: "text-muted-foreground",
  ok: "text-emerald-400",
  dim: "text-muted-foreground/60",
}

export function AiVisual({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = active
  const reduceMotion = useReducedMotion()
  const [shownState, setShown] = useState(0)
  const [typedState, setTyped] = useState(0)
  // Sem animação: mostra a sessão completa
  const typed = reduceMotion ? session[0].text.length : typedState
  const shown = reduceMotion ? session.length : shownState

  // Digita o comando, depois revela as linhas; repete enquanto visível
  useEffect(() => {
    if (reduceMotion) return
    // Só começa quando o card chega; depois de começar, termina a sessão
    // mesmo fora da vez. O loop (recomeçar) só acontece enquanto é a vez.
    const started = typed > 0 || shown > 0
    if (!inView && !started) return
    const prompt = session[0].text
    let id: ReturnType<typeof setTimeout>
    if (typed < prompt.length) {
      id = setTimeout(() => setTyped((t) => t + 1), 28)
    } else if (shown < session.length) {
      id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : 650)
    } else if (inView) {
      id = setTimeout(() => {
        setTyped(0)
        setShown(0)
      }, 4000)
    } else {
      return
    }
    return () => clearTimeout(id)
  }, [inView, reduceMotion, typed, shown])

  return (
    <Window title="~/projetos/jed-tec · zsh">
      <div
        ref={ref}
        className="space-y-2.5 p-5 font-mono text-[12.5px] leading-relaxed"
      >
        <p className={toneClass.prompt}>
          {session[0].text.slice(0, typed)}
          {shown === 0 && (
            <span className="bg-red-light ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse" />
          )}
        </p>
        {session.slice(1, Math.max(0, shown)).map((line) => (
          <motion.p
            key={line.text}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className={toneClass[line.tone ?? "info"]}
          >
            {line.text}
          </motion.p>
        ))}
        {shown >= session.length && (
          <p className="text-foreground">
            ${" "}
            <span className="bg-red-light inline-block h-4 w-2 translate-y-0.5 animate-pulse" />
          </p>
        )}
      </div>
    </Window>
  )
}

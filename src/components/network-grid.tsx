"use client"

import { useState, type PointerEvent } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

/* ---------- Geometria isométrica (viewBox 600×600) ---------- */

const VIEW = 600
const VIEW_BOX = `0 70 ${VIEW} 480`
const N = 8 // grid N×N células
const W = 34 // meia largura de uma célula na tela
const H = 17 // meia altura de uma célula na tela
const OX = VIEW / 2
const OY = 180

type Point = { x: number; y: number }

/** Projeta um ponto 3D do grid (i, j, altura z) para a tela. */
function iso(i: number, j: number, z = 0): Point {
  return { x: OX + (i - j) * W, y: OY + (i + j) * H - z }
}

const pts = (...p: Point[]) => p.map(({ x, y }) => `${x},${y}`).join(" ")

/** PRNG determinístico: mesmo layout no servidor e no cliente. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------- Rede: nós e conexões ---------- */

type NetNode = { id: string; label: string; i: number; j: number; h: number }

const nodes: NetNode[] = [
  { id: "ia", label: "IA", i: 3, j: 3, h: 84 },
  { id: "site", label: "Site", i: 0, j: 2, h: 44 },
  { id: "api", label: "API", i: 5, j: 0, h: 60 },
  { id: "crm", label: "CRM", i: 1, j: 5, h: 36 },
  { id: "n8n", label: "n8n", i: 6, j: 3, h: 40 },
  { id: "whatsapp", label: "WhatsApp", i: 6, j: 6, h: 28 },
  { id: "db", label: "Banco de dados", i: 3, j: 7, h: 50 },
  { id: "pay", label: "Pagamentos", i: 2, j: 0, h: 24 },
]

const edges: [string, string][] = [
  ["site", "ia"],
  ["api", "ia"],
  ["crm", "ia"],
  ["n8n", "ia"],
  ["db", "ia"],
  ["site", "pay"],
  ["pay", "api"],
  ["api", "n8n"],
  ["n8n", "whatsapp"],
  ["crm", "db"],
  ["db", "whatsapp"],
]

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))
const nodePoint = (n: NetNode) => iso(n.i + 0.5, n.j + 0.5, n.h)

/* ---------- Blocos (gerados uma vez, ordenados de trás para frente) ---------- */

type Block = { i: number; j: number; h: number; node?: boolean }

const blocks: Block[] = (() => {
  const rand = mulberry32(7)
  const heights = [6, 14, 26, 42, 58]
  const list: Block[] = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const node = nodes.find((n) => n.i === i && n.j === j)
      if (node) {
        list.push({ i, j, h: node.h, node: true })
        continue
      }
      const r = rand()
      const h = heights[Math.floor(rand() * heights.length)]
      if (r > 0.42) list.push({ i, j, h })
    }
  }
  // Pintor: quanto maior i + j, mais perto do observador
  return list.sort((a, b) => a.i + a.j - (b.i + b.j))
})()

const GAP = 0.09

function BlockShape({ i, j, h, node }: Block) {
  const i0 = i + GAP
  const i1 = i + 1 - GAP
  const j0 = j + GAP
  const j1 = j + 1 - GAP
  return (
    <g strokeWidth="0.6" stroke="rgb(255 255 255 / 0.06)">
      {/* face frontal direita */}
      <polygon
        points={pts(iso(i1, j0), iso(i1, j1), iso(i1, j1, h), iso(i1, j0, h))}
        fill="#0b0b0d"
      />
      {/* face frontal esquerda */}
      <polygon
        points={pts(iso(i0, j1), iso(i1, j1), iso(i1, j1, h), iso(i0, j1, h))}
        fill="#070708"
      />
      {/* topo */}
      <polygon
        points={pts(
          iso(i0, j0, h),
          iso(i1, j0, h),
          iso(i1, j1, h),
          iso(i0, j1, h)
        )}
        fill={node ? "url(#net-top-lit)" : "#141417"}
        stroke={node ? "rgb(255 52 59 / 0.45)" : undefined}
      />
    </g>
  )
}

/* ---------- Componente ---------- */

export function NetworkGrid({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)

  // Inclinação 3D seguindo o mouse
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 70, damping: 18 }
  const rotateX = useSpring(useTransform(py, [-1, 1], [8, -8]), spring)
  const rotateY = useSpring(useTransform(px, [-1, 1], [-8, 8]), spring)

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    py.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  const isLinked = ([a, b]: [string, string]) =>
    active !== null && (a === active || b === active)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      className={cn("group/net relative aspect-[600/480] w-full", className)}
      style={{ perspective: 1200 }}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
        setActive(null)
      }}
    >
      {/* Brilho vermelho sob a rede */}
      <div
        aria-hidden
        className="bg-red-dark/30 group-hover/net:bg-red-dark/50 absolute inset-x-[15%] top-[25%] bottom-[20%] rounded-full blur-3xl transition-colors duration-700"
      />

      <motion.svg
        viewBox={VIEW_BOX}
        role="img"
        aria-label="Rede de sistemas conectados: site, API, CRM, n8n, WhatsApp, banco de dados e pagamentos integrados por IA"
        className="absolute inset-0 size-full overflow-visible [mask-image:radial-gradient(ellipse_62%_58%_at_50%_48%,black_55%,transparent_100%)]"
        style={{ rotateX, rotateY }}
      >
        <defs>
          <linearGradient id="net-top-lit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a0a0c" />
            <stop offset="100%" stopColor="#141417" />
          </linearGradient>
          <radialGradient id="net-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FF343B" />
            <stop offset="100%" stopColor="#E50914" />
          </radialGradient>
        </defs>

        {/* Grid do chão */}
        <g stroke="rgb(255 255 255 / 0.05)" strokeWidth="0.6">
          {Array.from({ length: N + 1 }, (_, k) => {
            const a = iso(k, 0)
            const b = iso(k, N)
            const c = iso(0, k)
            const d = iso(N, k)
            return (
              <g key={k}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
              </g>
            )
          })}
        </g>

        {/* Blocos */}
        {blocks.map((b) => (
          <BlockShape key={`${b.i}-${b.j}`} {...b} />
        ))}

        {/* Conexões */}
        {edges.map((edge) => {
          const a = nodePoint(nodeById[edge[0]])
          const b = nodePoint(nodeById[edge[1]])
          const linked = isLinked(edge)
          return (
            <line
              key={edge.join("-")}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={linked ? "#FF343B" : "#F5F5F5"}
              strokeOpacity={linked ? 0.85 : active ? 0.06 : 0.16}
              strokeWidth={linked ? 1.2 : 0.8}
              className="transition-[stroke,stroke-opacity] duration-300"
            />
          )
        })}

        {/* Partículas de dados percorrendo as conexões */}
        {!reduceMotion &&
          edges.map((edge, k) => {
            const a = nodePoint(nodeById[edge[0]])
            const b = nodePoint(nodeById[edge[1]])
            return (
              <motion.circle
                key={`p-${edge.join("-")}`}
                r="2"
                fill="#FF343B"
                className="pointer-events-none drop-shadow-[0_0_4px_#FF343B]"
                initial={{ cx: a.x, cy: a.y, opacity: 0 }}
                animate={{
                  cx: [a.x, b.x],
                  cy: [a.y, b.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.8 + (k % 3) * 0.5,
                  delay: k * 0.45,
                  repeat: Infinity,
                  repeatDelay: 1.5 + (k % 4) * 0.6,
                  ease: "easeInOut",
                }}
              />
            )
          })}

        {/* Nós */}
        {nodes.map((node, k) => {
          const p = nodePoint(node)
          const hub = node.id === "ia"
          const isActive = active === node.id
          const r = hub ? 7 : 4.5
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onPointerEnter={() => setActive(node.id)}
              onPointerLeave={() => setActive(null)}
            >
              {/* área de hover maior que o ponto */}
              <circle cx={p.x} cy={p.y} r={18} fill="transparent" />

              {!reduceMotion && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  fill="none"
                  stroke="#FF343B"
                  strokeWidth="1"
                  initial={{ r, opacity: 0 }}
                  animate={{ r: [r, r * 3.2], opacity: [0.7, 0] }}
                  transition={{
                    duration: 2.4,
                    delay: k * 0.6,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeOut",
                  }}
                />
              )}

              <motion.circle
                cx={p.x}
                cy={p.y}
                fill="url(#net-node)"
                initial={{ r }}
                animate={{ r: isActive ? r * 1.5 : r }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                style={{
                  filter: `drop-shadow(0 0 ${isActive || hub ? 10 : 6}px #FF343B)`,
                }}
              />

              <text
                x={p.x}
                y={p.y - (hub ? 18 : 14)}
                textAnchor="middle"
                className={cn(
                  "pointer-events-none fill-current text-[11px] font-medium tracking-wide transition-[opacity,color] duration-300",
                  isActive
                    ? "text-foreground opacity-100"
                    : hub
                      ? "text-muted-foreground opacity-100"
                      : "text-muted-foreground opacity-0 group-hover/net:opacity-70"
                )}
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </motion.svg>
    </motion.div>
  )
}

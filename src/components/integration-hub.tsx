"use client"

import { useRef, type PointerEvent } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { BrainCircuit } from "lucide-react"
import {
  siClaude,
  siFigma,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siReact,
  siSupabase,
  siTypescript,
  siWordpress,
  type SimpleIcon,
} from "simple-icons"
import { cn } from "@/lib/utils"

/* Coordenadas do SVG: 600×600, núcleo no centro */
const VIEW = 600
const C = VIEW / 2

type Ring = {
  radius: number
  /** graus por segundo; o sinal define o sentido */
  speed: { rest: number; hover: number }
  /** tamanho do nó em % do container */
  nodeSize: number
  offset: number
  icons: SimpleIcon[]
}

const rings: Ring[] = [
  {
    radius: 140,
    speed: { rest: 7, hover: 22 },
    nodeSize: 10,
    offset: 45,
    icons: [siClaude, siN8n, siSupabase, siNextdotjs],
  },
  {
    radius: 248,
    speed: { rest: -4, hover: -13 },
    nodeSize: 8.5,
    offset: 0,
    icons: [siReact, siTypescript, siNodedotjs, siWordpress, siPhp, siFigma],
  },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function polar(radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: C + radius * Math.cos(rad), y: C + radius * Math.sin(rad) }
}

export function IntegrationHub({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const hovering = useRef(false)
  const mix = useRef(0)

  const angles = [useMotionValue(0), useMotionValue(0)]

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return
    mix.current = lerp(mix.current, hovering.current ? 1 : 0, 0.05)
    const dt = Math.min(delta, 64) / 1000
    rings.forEach((ring, i) => {
      const speed = lerp(ring.speed.rest, ring.speed.hover, mix.current)
      angles[i].set(angles[i].get() + speed * dt)
    })
  })

  // Inclinação 3D seguindo o mouse
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-1, 1], [10, -10]), {
    stiffness: 80,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(px, [-1, 1], [-10, 10]), {
    stiffness: 80,
    damping: 18,
  })

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    py.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      className={cn("group/hub relative aspect-square w-full", className)}
      style={{ perspective: 1200 }}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => {
        hovering.current = false
        px.set(0)
        py.set(0)
      }}
      onPointerMove={handleMove}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Brilho de fundo */}
        <div
          aria-hidden
          className="bg-red-dark/35 group-hover/hub:bg-red-dark/60 absolute inset-[22%] rounded-full blur-3xl transition-colors duration-700"
        />

        {/* Trilhas das órbitas */}
        <svg
          aria-hidden
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id="hub-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF343B" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#FF343B" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <circle
            cx={C}
            cy={C}
            r={rings[0].radius}
            fill="none"
            stroke="url(#hub-ring)"
          />
          <circle
            cx={C}
            cy={C}
            r={rings[1].radius}
            fill="none"
            stroke="#F5F5F5"
            strokeOpacity="0.07"
            strokeDasharray="2 7"
          />
        </svg>

        {rings.map((ring, i) => (
          <RingLayer key={i} ring={ring} ringIndex={i} angle={angles[i]} />
        ))}

        <Core />
      </motion.div>
    </motion.div>
  )
}

function RingLayer({
  ring,
  ringIndex,
  angle,
}: {
  ring: Ring
  ringIndex: number
  angle: MotionValue<number>
}) {
  const counter = useTransform(angle, (a) => -a)
  const step = 360 / ring.icons.length

  return (
    <motion.div className="absolute inset-0" style={{ rotate: angle }}>
      {/* Conexões e pulsos de dados (giram junto com a órbita) */}
      <svg
        aria-hidden
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          <radialGradient
            id={`hub-link-${ringIndex}`}
            cx={C}
            cy={C}
            r={ring.radius}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.06" />
          </radialGradient>
        </defs>
        {ring.icons.map((icon, j) => {
          const p = polar(ring.radius, ring.offset + j * step)
          const delay = ringIndex * 0.7 + j * 0.9
          return (
            <g key={icon.slug}>
              <line
                x1={C}
                y1={C}
                x2={p.x}
                y2={p.y}
                stroke={`url(#hub-link-${ringIndex})`}
                strokeWidth="1"
              />
              <motion.circle
                r="2.5"
                fill="#FF343B"
                className="drop-shadow-[0_0_6px_#FF343B]"
                initial={{ cx: p.x, cy: p.y, opacity: 0 }}
                animate={{
                  cx: [p.x, C],
                  cy: [p.y, C],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.2 + ringIndex * 0.6,
                  delay,
                  repeat: Infinity,
                  repeatDelay: 2.5 + (j % 3),
                  ease: "easeIn",
                }}
              />
            </g>
          )
        })}
      </svg>

      {/* Nós com as logos */}
      {ring.icons.map((icon, j) => {
        const p = polar(ring.radius, ring.offset + j * step)
        return (
          <div
            key={icon.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(p.x / VIEW) * 100}%`,
              top: `${(p.y / VIEW) * 100}%`,
              width: `${ring.nodeSize}%`,
            }}
          >
            <motion.div
              style={{ rotate: counter }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.6 + ringIndex * 0.3 + j * 0.08,
                ease: "easeOut",
              }}
              className="group/node relative"
            >
              <div className="border-border bg-background-secondary/90 text-muted-foreground group-hover/node:border-red-primary group-hover/node:text-foreground flex aspect-square w-full items-center justify-center rounded-full border backdrop-blur-sm transition-[color,border-color,box-shadow] duration-300 group-hover/node:shadow-[0_0_24px_-2px_rgb(229_9_20/0.7)]">
                <svg
                  role="img"
                  aria-label={icon.title}
                  viewBox="0 0 24 24"
                  className="size-[46%] fill-current"
                >
                  <path d={icon.path} />
                </svg>
              </div>
              <span className="text-muted-foreground pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/node:opacity-100">
                {icon.title}
              </span>
            </motion.div>
          </div>
        )
      })}
    </motion.div>
  )
}

function Core() {
  return (
    <div className="absolute inset-[39%]">
      {/* Ondas pulsando a partir do núcleo */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          aria-hidden
          className="border-red-light/50 absolute inset-0 rounded-full border"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{
            duration: 3.6,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FF343B_0%,#E50914_28%,#85080E_62%,#480609_100%)] shadow-[0_0_60px_8px_rgb(229_9_20/0.45),inset_0_0_24px_rgb(0_0_0/0.5)] transition-shadow duration-700 group-hover/hub:shadow-[0_0_90px_16px_rgb(229_9_20/0.6),inset_0_0_24px_rgb(0_0_0/0.5)]" />
      <div className="absolute inset-[6%] rounded-full border border-white/15" />

      <div className="text-foreground absolute inset-0 flex items-center justify-center">
        <BrainCircuit className="size-[42%] drop-shadow-[0_0_8px_rgb(245_245_245/0.6)]" />
      </div>
    </div>
  )
}

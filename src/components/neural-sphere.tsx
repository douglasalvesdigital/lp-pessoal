"use client"

import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

/* ---------- Parâmetros ---------- */

/** Neurônios: menos em telas pequenas (menos cálculo no celular). */
const NODE_COUNT = { desktop: 210, mobile: 120 }
const NEIGHBORS = 3 // conexões por neurônio
const MAX_PULSES = 46
const SPEED = { rest: 0.12, hover: 0.42 } // rad/s
const PULSE_SPEED = 1.6 // fração da sinapse por segundo
const SPAWN_EVERY = 0.16 // s entre disparos espontâneos
const CASCADE = 0.62 // chance de um neurônio repassar o sinal
const HOVER_RADIUS = 90 // px

/* ---------- Tipos ---------- */

type Neuron = {
  x: number
  y: number
  z: number
  links: number[] // índices de sinapses
  charge: number // 0–1, brilho após disparo
  // projeção do frame atual
  sx: number
  sy: number
  depth: number
}

type Synapse = { a: number; b: number; heat: number }
type Pulse = { s: number; from: number; t: number }

/* ---------- Construção da rede ---------- */

function buildNetwork(NODE_COUNT: number) {
  const neurons: Neuron[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < NODE_COUNT; i++) {
    // Esfera de Fibonacci com variação de raio: superfície + volume
    const y = 1 - (i / (NODE_COUNT - 1)) * 2
    const ring = Math.sqrt(1 - y * y)
    const theta = golden * i
    const r = 0.72 + Math.random() * 0.28
    const jitter = () => (Math.random() - 0.5) * 0.08
    neurons.push({
      x: Math.cos(theta) * ring * r + jitter(),
      y: y * r + jitter(),
      z: Math.sin(theta) * ring * r + jitter(),
      links: [],
      charge: 0,
      sx: 0,
      sy: 0,
      depth: 0,
    })
  }

  const synapses: Synapse[] = []
  const seen = new Set<string>()
  neurons.forEach((n, i) => {
    const nearest = neurons
      .map((m, j) => ({
        j,
        d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 + (m.z - n.z) ** 2,
      }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, NEIGHBORS)
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      const s = synapses.push({ a: i, b: j, heat: 0 }) - 1
      n.links.push(s)
      neurons[j].links.push(s)
    }
  })

  return { neurons, synapses }
}

/* ---------- Componente ---------- */

export function NeuralSphere({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Só começa depois que a página assentou: o carregamento inicial fica
    // livre para pintar a foto e o texto (melhora o LCP no celular)
    let cleanup: (() => void) | undefined
    const start = () => {
      cleanup = init()
    }
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 600)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number)
      else window.clearTimeout(idle as number)
      cleanup?.()
    }

    function init() {
      const wrap = wrapRef.current
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!wrap || !canvas || !ctx) return

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      const small = window.matchMedia("(max-width: 767px)").matches
      const { neurons, synapses } = buildNetwork(
        small ? NODE_COUNT.mobile : NODE_COUNT.desktop,
      )
      const pulses: Pulse[] = []

      let size = 0
      let dpr = 1
      const resize = () => {
        dpr = Math.min(window.devicePixelRatio, 2)
        size = wrap.clientWidth
        canvas.width = size * dpr
        canvas.height = size * dpr
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(wrap)

      // Ponteiro
      const pointer = { x: 0, y: 0, nx: 0, ny: 0, inside: false }
      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect()
        pointer.x = e.clientX - rect.left
        pointer.y = e.clientY - rect.top
        pointer.nx = (pointer.x / rect.width) * 2 - 1
        pointer.ny = (pointer.y / rect.height) * 2 - 1
        pointer.inside = true
      }
      const onLeave = () => (pointer.inside = false)
      wrap.addEventListener("pointermove", onMove)
      wrap.addEventListener("pointerleave", onLeave)

      const fire = (from: number) => {
        if (pulses.length >= MAX_PULSES) return
        const links = neurons[from].links
        if (!links.length) return
        const s = links[Math.floor(Math.random() * links.length)]
        pulses.push({ s, from, t: 0 })
      }

      let rotY = 0
      let tiltX = 0.35
      let tiltY = 0
      let speed = SPEED.rest
      let spawnClock = 0
      let hoverClock = 0
      let last = performance.now()
      let frame = 0
      let visible = true

      const step = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now

        const hovering = pointer.inside
        speed += ((hovering ? SPEED.hover : SPEED.rest) - speed) * 0.04
        rotY += speed * dt
        tiltX += ((hovering ? 0.35 + pointer.ny * 0.35 : 0.35) - tiltX) * 0.05
        tiltY += ((hovering ? pointer.nx * 0.5 : 0) - tiltY) * 0.05

        // Projeção
        const cy = Math.cos(rotY + tiltY)
        const sy = Math.sin(rotY + tiltY)
        const cx = Math.cos(tiltX)
        const sx = Math.sin(tiltX)
        const half = size / 2
        const radius = size * 0.4
        const camera = 2.8
        for (const n of neurons) {
          const x1 = n.x * cy - n.z * sy
          const z1 = n.x * sy + n.z * cy
          const y2 = n.y * cx - z1 * sx
          const z2 = n.y * sx + z1 * cx
          const p = camera / (camera - z2)
          n.sx = half + x1 * radius * p
          n.sy = half + y2 * radius * p
          n.depth = (z2 + 1) / 2 // 0 = fundo, 1 = frente
          n.charge = Math.max(0, n.charge - dt * 1.4)
        }
        for (const s of synapses) s.heat = Math.max(0, s.heat - dt * 1.2)

        // Disparos espontâneos
        spawnClock += dt
        while (spawnClock > SPAWN_EVERY) {
          spawnClock -= SPAWN_EVERY
          fire(Math.floor(Math.random() * neurons.length))
        }

        // Mouse estimula os neurônios próximos
        if (hovering) {
          hoverClock += dt
          for (let i = 0; i < neurons.length; i++) {
            const n = neurons[i]
            const d = Math.hypot(n.sx - pointer.x, n.sy - pointer.y)
            if (d < HOVER_RADIUS && n.depth > 0.4) {
              n.charge = Math.max(n.charge, 1 - d / HOVER_RADIUS)
              if (hoverClock > 0.05 && Math.random() < 0.08) fire(i)
            }
          }
          if (hoverClock > 0.05) hoverClock = 0
        }

        // Pulsos avançam; ao chegar, o neurônio dispara e pode repassar
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pulse = pulses[k]
          pulse.t += dt * PULSE_SPEED
          synapses[pulse.s].heat = 1
          if (pulse.t >= 1) {
            const syn = synapses[pulse.s]
            const target = syn.a === pulse.from ? syn.b : syn.a
            neurons[target].charge = 1
            pulses.splice(k, 1)
            if (Math.random() < CASCADE) fire(target)
            if (Math.random() < CASCADE * 0.35) fire(target)
          }
        }

        draw()
        if (!reduceMotion && visible) frame = requestAnimationFrame(step)
      }

      const draw = () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, size, size)

        // Sinapses
        ctx.lineWidth = 0.7
        for (const s of synapses) {
          const a = neurons[s.a]
          const b = neurons[s.b]
          const depth = (a.depth + b.depth) / 2
          const base = 0.04 + depth * 0.16
          ctx.strokeStyle =
            s.heat > 0.02
              ? `rgba(255, 52, 59, ${base + s.heat * 0.45})`
              : `rgba(245, 245, 245, ${base})`
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }

        // Neurônios
        for (const n of neurons) {
          const r = 0.8 + n.depth * 1.8 + n.charge * 1.6
          if (n.charge > 0.05) {
            ctx.fillStyle = `rgba(229, 9, 20, ${n.charge * 0.25})`
            ctx.beginPath()
            ctx.arc(n.sx, n.sy, r * 4, 0, Math.PI * 2)
            ctx.fill()
          }
          const g = Math.round(163 - n.charge * 140)
          ctx.fillStyle =
            n.charge > 0.05
              ? `rgba(255, ${g}, ${g}, ${0.5 + n.charge * 0.5})`
              : `rgba(163, 163, 163, ${0.2 + n.depth * 0.6})`
          ctx.beginPath()
          ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2)
          ctx.fill()
        }

        // Sinais viajando
        ctx.globalCompositeOperation = "lighter"
        for (const pulse of pulses) {
          const syn = synapses[pulse.s]
          const from = neurons[pulse.from]
          const to = neurons[syn.a === pulse.from ? syn.b : syn.a]
          const x = from.sx + (to.sx - from.sx) * pulse.t
          const y = from.sy + (to.sy - from.sy) * pulse.t
          const depth = from.depth + (to.depth - from.depth) * pulse.t
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 7)
          glow.addColorStop(0, `rgba(255, 120, 120, ${0.5 + depth * 0.5})`)
          glow.addColorStop(0.35, `rgba(255, 52, 59, ${0.35 + depth * 0.4})`)
          glow.addColorStop(1, "rgba(229, 9, 20, 0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, 7, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalCompositeOperation = "source-over"
      }

      // Só anima quando está na tela
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !reduceMotion) {
          cancelAnimationFrame(frame)
          last = performance.now()
          frame = requestAnimationFrame(step)
        }
      })
      io.observe(wrap)

      frame = requestAnimationFrame(step)

      return () => {
        cancelAnimationFrame(frame)
        ro.disconnect()
        io.disconnect()
        wrap.removeEventListener("pointermove", onMove)
        wrap.removeEventListener("pointerleave", onLeave)
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
      data-synapse-origin
      className={cn("group/neural relative aspect-square w-full", className)}
    >
      {/* Núcleo de luz atrás da rede */}
      <div
        aria-hidden
        className="bg-red-dark/30 group-hover/neural:bg-red-dark/50 absolute inset-[18%] rounded-full blur-3xl transition-colors duration-700"
      />
      <div
        ref={wrapRef}
        role="img"
        aria-label="Rede neural em forma de esfera com sinais disparando entre os neurônios"
        className="absolute inset-0"
      >
        <canvas ref={canvasRef} className="block" />
      </div>
    </motion.div>
  )
}

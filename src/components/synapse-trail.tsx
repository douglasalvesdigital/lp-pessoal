"use client"

import { useEffect, useRef } from "react"
import { SYNAPSE_ARRIVE_EVENT } from "@/components/contact-screen"

/** Seções onde há um "neurônio" que acende quando o impulso passa. */
// O contato não tem nó: é o destino final (o card que "liga")
const NODE_TARGETS = ["#especialidades", "#projetos", "#sobre"]
/** Comprimento do rastro atrás do impulso, em px. */
const TRAIL = 520
/** Distância percorrida até o caminho sair da esfera e chegar à lateral. */
const DETACH = 520
/** Distância final em que o caminho sai da lateral e vai ao centro do card. */
const TURN = 400
/** Quanto o impulso precisa voltar para o card desligar (evita piscar). */
const LEAVE = 180
const CONTENT_WIDTH = 1280

type Geometry = {
  width: number
  height: number
  origin: { x: number; y: number }
  end: number
  /** x do destino final (centro do card de contato). */
  endX: number
  base: number
  amp: number
  nodes: number[]
}

const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

/** x do caminho em cada altura: sai da esfera e ondula pela lateral direita. */
function pathX(y: number, g: Geometry) {
  const wave =
    g.base + g.amp * Math.sin(y / 520) + g.amp * 0.55 * Math.sin(y / 1370 + 1.3)
  const t = smoothstep((y - g.origin.y) / DETACH)
  const side = g.origin.x + (wave - g.origin.x) * t
  // No fim, deixa a lateral e chega ao centro do card de contato
  const t2 = smoothstep((y - (g.end - TURN)) / TURN)
  return side + (g.endX - side) * t2
}

function pathD(from: number, to: number, g: Geometry) {
  const step = 16
  let d = ""
  for (let y = from; y <= to; y += step) {
    d += `${d ? "L" : "M"}${pathX(y, g).toFixed(1)},${y.toFixed(1)}`
  }
  return d + `L${pathX(to, g).toFixed(1)},${to.toFixed(1)}`
}

/**
 * Impulso de sinapse que se solta da esfera da hero e percorre a lateral
 * direita do site conforme a rolagem, por trás do conteúdo.
 * Deve ser o primeiro filho de um container `relative` que envolve as seções.
 */
export function SynapseTrail() {
  const svgRef = useRef<SVGSVGElement>(null)
  const guideRef = useRef<SVGPathElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const gradRef = useRef<SVGLinearGradientElement>(null)
  const dotRef = useRef<SVGGElement>(null)
  const nodesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const container = svg?.parentElement
    if (!svg || !container) return

    let g: Geometry | null = null
    let frame = 0

    const measure = () => {
      const origin = document.querySelector<HTMLElement>(
        "[data-synapse-origin]",
      )
      const top = container.getBoundingClientRect().top + window.scrollY
      const width = document.documentElement.clientWidth
      // offsetHeight (e não scrollHeight): o próprio SVG não pode influenciar a altura
      const height = container.offsetHeight
      const margin = Math.max(0, (width - CONTENT_WIDTH) / 2)
      const base = margin > 60 ? width - margin / 2 : width - 36
      // A onda (até 1,55 × amp) precisa caber na metade da margem
      const amp =
        margin > 60 ? Math.max(8, Math.min((margin / 2 - 18) / 1.55, 60)) : 8

      const rect = origin?.getBoundingClientRect()
      const originPt = rect
        ? {
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - top + rect.height / 2,
          }
        : { x: base, y: window.innerHeight / 2 }

      // Destino: topo do card de contato (ou o fim da página, se não houver)
      const target = document.querySelector<HTMLElement>(
        "[data-synapse-target]",
      )
      const targetRect = target?.getBoundingClientRect()
      const end = targetRect
        ? targetRect.top + window.scrollY - top
        : height - 40
      const endX = targetRect ? targetRect.left + targetRect.width / 2 : base

      const nodes = NODE_TARGETS.map((sel) => {
        const el = document.querySelector<HTMLElement>(sel)
        return el
          ? el.getBoundingClientRect().top + window.scrollY - top + 40
          : -1
      }).filter((y) => y > originPt.y + DETACH)

      g = { width, height, origin: originPt, end, endX, base, amp, nodes }

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
      svg.style.height = `${height}px`
      guideRef.current?.setAttribute("d", pathD(originPt.y, end, g))

      // Recria os neurônios nas novas posições
      const group = nodesRef.current
      if (group) {
        group.replaceChildren(
          ...nodes.map((y) => {
            const node = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "g",
            )
            node.setAttribute("transform", `translate(${pathX(y, g!)},${y})`)
            node.innerHTML =
              '<circle r="14" class="synapse-halo" /><circle r="3.5" class="synapse-core" />'
            return node
          }),
        )
      }
      update()
    }

    const update = () => {
      if (!g) return
      const viewportY = g.origin.y // o impulso fica na altura em que a esfera estava
      let wanted = window.scrollY + viewportY
      // O card pode estar perto demais do fim da página para o impulso
      // alcançá-lo só rolando: no trecho final ele acelera e chega
      // exatamente ao card quando a rolagem termina.
      const maxWanted =
        document.documentElement.scrollHeight - window.innerHeight + viewportY
      const shortfall = g.end - maxWanted
      if (shortfall > 0) {
        const ramp = 600
        wanted += shortfall * smoothstep((wanted - (maxWanted - ramp)) / ramp)
      }
      const y = Math.min(g.end, Math.max(g.origin.y, wanted))
      const x = pathX(y, g)

      // Aparece quando a pessoa começa a sair da hero
      const reveal = Math.min(1, Math.max(0, (window.scrollY - 40) / 220))
      svg.style.opacity = String(reveal)

      dotRef.current?.setAttribute("transform", `translate(${x},${y})`)
      const from = Math.max(g.origin.y, y - TRAIL)
      trailRef.current?.setAttribute("d", pathD(from, y, g))
      gradRef.current?.setAttribute("y1", String(from))
      gradRef.current?.setAttribute("y2", String(y))

      nodesRef.current?.childNodes.forEach((node, i) => {
        ;(node as SVGGElement).classList.toggle("is-active", y >= g!.nodes[i])
      })

      // Chegou ao card: liga a tela do contato. Volta um pouco: desliga.
      if (!arrived && wanted >= g.end - 1) setArrived(true)
      else if (arrived && wanted < g.end - LEAVE) setArrived(false)
    }

    let arrived = false
    const setArrived = (value: boolean) => {
      arrived = value
      window.dispatchEvent(
        new CustomEvent(SYNAPSE_ARRIVE_EVENT, { detail: value }),
      )
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    // A altura da página muda com imagens, vídeos e fontes carregando
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    observer.observe(container)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    frame = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="synapse-trail pointer-events-none absolute inset-x-0 top-0 hidden w-full opacity-0 lg:block"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          ref={gradRef}
          id="synapse-trail"
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
        >
          <stop offset="0%" stopColor="#E50914" stopOpacity="0" />
          <stop offset="100%" stopColor="#FF343B" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id="synapse-glow">
          <stop offset="0%" stopColor="#FF343B" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Nervo: o caminho inteiro, quase invisível */}
      <path
        ref={guideRef}
        fill="none"
        stroke="#F5F5F5"
        strokeOpacity="0.05"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
      {/* Rastro que se apaga atrás do impulso */}
      <path
        ref={trailRef}
        fill="none"
        stroke="url(#synapse-trail)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <g ref={nodesRef} />
      {/* Impulso */}
      <g ref={dotRef}>
        <circle r="18" fill="url(#synapse-glow)" />
        <circle
          r="7"
          className="synapse-pulse"
          fill="none"
          stroke="#FF343B"
          strokeOpacity="0.4"
        />
        <circle r="2.5" fill="#FF8A8F" />
        <circle
          r="4.5"
          fill="none"
          stroke="#FF343B"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}

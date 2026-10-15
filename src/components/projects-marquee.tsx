"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react"
import { createPortal } from "react-dom"
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { ProjectTile, type Project } from "@/components/project-card"
import { cn } from "@/lib/utils"

/** Velocidade da faixa, em px por segundo. */
const SPEED = 22
/** A partir de quantos px de movimento um toque/clique vira arraste. */
const DRAG_THRESHOLD = 6
/** Fração da velocidade de inércia que sobra após 1s. */
const FRICTION = 0.04
/** Quão rápido a faixa acelera/desacelera ao parar ou voltar (maior = mais rápido). */
const EASING = 2.2
/** Tempo com o mouse parado sobre o card antes de ele crescer (ms). */
const HOVER_INTENT = 160
/** Tempo para o mouse sair de um card e chegar ao vizinho sem fechar (ms). */
const LEAVE_GRACE = 120

/**
 * Faixa contínua de projetos. Anda sozinha, pode ser arrastada (com inércia)
 * e, ao interagir com um card, para e o card cresce mostrando o site.
 */
export function ProjectsMarquee({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion()
  // "cópia-índice" do card ativo; as duas cópias da lista têm cards iguais
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const copyRef = useRef<HTMLUListElement>(null)
  const x = useMotionValue(0)
  const drag = useRef({
    offset: 0, // px andados (cresce para a esquerda)
    velocity: 0, // px/s, inércia após soltar
    down: false,
    dragging: false,
    justDragged: false,
    startX: 0,
    startOffset: 0,
    lastX: 0,
    lastT: 0,
    paused: false,
    speed: 0, // velocidade atual, suavizada até o alvo
  })
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  const activeRef = useRef<string | null>(null)
  useEffect(() => {
    drag.current.paused = activeKey !== null
    activeRef.current = activeKey
  }, [activeKey])

  // Começa com o primeiro projeto centralizado na tela
  const viewportRef = useRef<HTMLDivElement>(null)
  // Só anda quando está na tela (e não sai do centro antes de ser vista)
  const inView = useInView(viewportRef, { margin: "-20% 0px" })
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const first = copyRef.current?.firstElementChild as HTMLElement | null
    if (!viewport || !first) return
    drag.current.offset = -(viewport.clientWidth - first.offsetWidth) / 2
  }, [])

  useAnimationFrame((_, delta) => {
    const s = drag.current
    const width = copyRef.current?.offsetWidth ?? 0
    if (!width) return
    const dt = Math.min(delta, 64) / 1000

    if (!s.dragging) {
      if (Math.abs(s.velocity) > 4) {
        s.offset += s.velocity * dt
        s.velocity *= Math.pow(FRICTION, dt)
      } else {
        s.velocity = 0
        // Desacelera até parar no hover e acelera de volta ao sair
        const target = !s.paused && inView && !reduceMotion ? SPEED : 0
        s.speed += (target - s.speed) * (1 - Math.exp(-dt * EASING))
        s.offset += s.speed * dt
      }
    }
    // Duas cópias: ao passar uma largura inteira, volta ao início sem emenda
    x.set(-(((s.offset % width) + width) % width))
  })

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const s = drag.current
    Object.assign(s, {
      down: true,
      justDragged: false,
      startX: e.clientX,
      startOffset: s.offset,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
    })
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = drag.current
    if (!s.down) return
    const dx = e.clientX - s.startX

    if (!s.dragging && Math.abs(dx) > DRAG_THRESHOLD) {
      s.dragging = true
      setDragging(true)
      setActiveKey(null)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (!s.dragging) return

    s.offset = s.startOffset - dx
    const dt = (e.timeStamp - s.lastT) / 1000
    if (dt > 0) s.velocity = -(e.clientX - s.lastX) / dt
    s.lastX = e.clientX
    s.lastT = e.timeStamp
  }

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const s = drag.current
    s.down = false
    if (!s.dragging) return
    s.dragging = false
    s.justDragged = true
    // Se ficou parado antes de soltar, não há inércia
    if (e.timeStamp - s.lastT > 80) s.velocity = 0
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  // Com um card já aberto, passar para outro troca na hora (sem fechar e
  // reabrir); vindo do nada, espera a intenção para não saltar à toa.
  const activate = (key: string) => {
    clearTimeout(hoverTimer.current)
    if (activeRef.current !== null) {
      setActiveKey(key)
      return
    }
    hoverTimer.current = setTimeout(() => {
      if (!drag.current.dragging) setActiveKey(key)
    }, HOVER_INTENT)
  }
  const deactivate = () => {
    clearTimeout(hoverTimer.current)
    // Pequena tolerância para o mouse chegar ao card vizinho
    hoverTimer.current = setTimeout(() => setActiveKey(null), LEAVE_GRACE)
  }

  // Toque: tocar fora da faixa fecha o card aberto
  useEffect(() => {
    if (activeKey === null) return
    const close = (e: globalThis.PointerEvent) => {
      if (e.pointerType === "mouse") return
      if (!viewportRef.current?.contains(e.target as Node)) setActiveKey(null)
    }
    window.addEventListener("pointerdown", close)
    return () => window.removeEventListener("pointerdown", close)
  }, [activeKey])

  return (
    <>
      {/* Fundo desfocado para destacar o card ampliado (não captura o mouse) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeKey !== null && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="pointer-events-none fixed inset-0 z-40 backdrop-blur-md"
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        // Depois de um arraste, o clique não deve abrir links
        onClickCapture={(e) => {
          if (drag.current.justDragged) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        className={cn(
          // Espaço vertical para o card ampliado não ser cortado pela máscara
          "relative touch-pan-y overflow-x-clip py-24 select-none [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
          dragging ? "cursor-grabbing" : "cursor-grab",
          // Fica acima da máscara enquanto um card está em destaque
          // Sempre acima do fundo desfocado, para nunca perder o hover
          "z-50",
        )}
      >
        <motion.div className="flex w-max" style={{ x }}>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? copyRef : undefined}
              aria-hidden={copy === 1}
              className="flex shrink-0 gap-7 pr-7"
            >
              {projects.map((project, i) => {
                const key = `${copy}-${i}`
                return (
                  <li
                    key={key}
                    // Mouse: hover. Toque: um toque abre, outro fecha.
                    onPointerEnter={(e) =>
                      e.pointerType === "mouse" &&
                      !drag.current.dragging &&
                      activate(key)
                    }
                    onPointerLeave={(e) =>
                      e.pointerType === "mouse" && deactivate()
                    }
                    onPointerUp={(e) =>
                      e.pointerType !== "mouse" &&
                      !drag.current.justDragged &&
                      setActiveKey((current) => (current === key ? null : key))
                    }
                    className={cn(
                      "relative transition-[filter] duration-700 ease-in-out",
                      activeKey === key && "z-20",
                      // Os outros cards ficam desfocados enquanto um está em destaque
                      activeKey !== null &&
                        activeKey !== key &&
                        "blur-[6px]",
                    )}
                  >
                    <ProjectTile
                      project={project}
                      active={activeKey === key}
                      decorative={copy === 1}
                    />
                  </li>
                )
              })}
            </ul>
          ))}
        </motion.div>
      </div>
    </>
  )
}

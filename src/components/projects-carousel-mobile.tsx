"use client"

import { useEffect, useState } from "react"
import { motion, type PanInfo } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProjectTile, type Project } from "@/components/project-card"
import { cn } from "@/lib/utils"

/** Distância entre um card e o próximo, em % da largura do card. */
const STEP = 104
/** Quanto arrastar (px) para passar de projeto. */
const SWIPE = 50

/**
 * Carrossel do celular: parado, com um projeto no centro (vídeo tocando e
 * informações abertas) e as pontas dos vizinhos nas laterais. Navega pelas
 * setas, arrastando ou tocando na prévia lateral. Dá a volta nas pontas.
 */
export function ProjectsCarouselMobile({ projects }: { projects: Project[] }) {
  const total = projects.length
  const [index, setIndex] = useState(0)
  // Só ativa (e baixa vídeo) quando este carrossel é o visível
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const go = (to: number) => setIndex(((to % total) + total) % total)

  // Distância circular até o card central: -1 (esquerda), 0, 1 (direita)...
  const offsetOf = (i: number) => {
    let d = i - index
    if (d > total / 2) d -= total
    if (d < -total / 2) d += total
    return d
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE) go(index + 1)
    else if (info.offset.x > SWIPE) go(index - 1)
  }

  const current = projects[index]

  return (
    <div className="overflow-hidden pb-4">
      <div className="relative">
        {/* Área do card central; os vizinhos ficam deslocados para os lados */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
          className="relative mx-auto aspect-[4/5] w-[72vw] max-w-[340px] touch-pan-y"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Projetos"
        >
          {projects.map((project, i) => {
            const d = offsetOf(i)
            const visible = Math.abs(d) <= 1
            return (
              <motion.div
                key={project.name}
                initial={false}
                animate={{
                  x: `${d * STEP}%`,
                  scale: d === 0 ? 1 : 0.88,
                  opacity: d === 0 ? 1 : visible ? 0.5 : 0,
                }}
                transition={
                  visible
                    ? { type: "spring", stiffness: 260, damping: 30 }
                    : { duration: 0 }
                }
                onClick={() => d !== 0 && visible && go(i)}
                aria-hidden={d !== 0}
                className={cn(
                  "absolute inset-0",
                  d === 0 ? "z-10" : "z-0",
                  !visible && "pointer-events-none",
                )}
              >
                <ProjectTile
                  project={project}
                  active={enabled && d === 0}
                  expand={false}
                  decorative={d !== 0}
                  className="aspect-auto size-full"
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Setas sobre as prévias laterais */}
        {[
          {
            dir: -1,
            label: "Projeto anterior",
            icon: ChevronLeft,
            side: "left-3",
          },
          {
            dir: 1,
            label: "Próximo projeto",
            icon: ChevronRight,
            side: "right-3",
          },
        ].map(({ dir, label, icon: Icon, side }) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(index + dir)}
            aria-label={label}
            className={cn(
              "border-border/80 bg-background/80 text-foreground absolute top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors active:border-red-primary/60",
              side,
            )}
          >
            <Icon className="size-5" />
          </button>
        ))}
      </div>

      {/* Indicadores */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="font-mono text-xs tabular-nums">
          {String(index + 1).padStart(2, "0")}
          <span className="text-muted-foreground/60">
            {" "}
            / {String(total).padStart(2, "0")}
          </span>
        </span>
        <div className="flex items-center gap-1.5">
          {projects.map((project, i) => (
            <button
              key={project.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ir para ${project.name}`}
              aria-current={i === index}
              className={cn(
                "h-1 rounded-full transition-[width,background-color] duration-300",
                i === index ? "bg-red-primary w-6" : "bg-border w-2",
              )}
            />
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {current.name}
      </p>
    </div>
  )
}

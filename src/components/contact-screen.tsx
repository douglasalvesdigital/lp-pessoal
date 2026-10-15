"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

/** Disparado pelo impulso de sinapse ao chegar (true) ou sair (false) do card. */
export const SYNAPSE_ARRIVE_EVENT = "synapse:arrive"

/* Tela CRT: ponto → linha de luz → abre na vertical com flash */
const screen: Variants = {
  hidden: { scaleX: 0.06, scaleY: 0.006, opacity: 0 },
  on: {
    scaleX: [0.06, 1, 1],
    scaleY: [0.006, 0.006, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.95, times: [0, 0.38, 1], ease: "easeInOut" },
  },
  off: {
    scaleX: [1, 1, 0.06],
    scaleY: [1, 0.006, 0.006],
    opacity: [1, 1, 0],
    transition: { duration: 0.55, times: [0, 0.55, 1], ease: "easeIn" },
  },
}

const flash: Variants = {
  hidden: { opacity: 0 },
  on: {
    opacity: [1, 1, 0],
    transition: { duration: 1.1, times: [0, 0.4, 1], ease: "easeOut" },
  },
  off: { opacity: [0, 1], transition: { duration: 0.3 } },
}

const scanlines: Variants = {
  hidden: { opacity: 0 },
  on: {
    opacity: [0.7, 0.7, 0.1],
    transition: { duration: 1.8, times: [0, 0.5, 1] },
  },
  off: { opacity: 0.5, transition: { duration: 0.2 } },
}

const content: Variants = {
  hidden: { opacity: 0, y: 8 },
  on: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.5 } },
  off: { opacity: 0, transition: { duration: 0.15 } },
}

/** Sem animação: apenas aparece. */
const fade: Variants = {
  hidden: { opacity: 0 },
  on: { opacity: 1, transition: { duration: 0.4 } },
  off: { opacity: 0 },
}

export function ContactScreen({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"hidden" | "on" | "off">("hidden")

  useEffect(() => {
    const onArrive = (e: Event) =>
      setState((e as CustomEvent<boolean>).detail ? "on" : "off")
    window.addEventListener(SYNAPSE_ARRIVE_EVENT, onArrive)

    // Sem o impulso (telas menores): liga ao entrar na tela
    let observer: IntersectionObserver | undefined
    if (!window.matchMedia("(min-width: 1024px)").matches && ref.current) {
      observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setState("on"),
        { threshold: 0.35 },
      )
      observer.observe(ref.current)
    }

    return () => {
      window.removeEventListener(SYNAPSE_ARRIVE_EVENT, onArrive)
      observer?.disconnect()
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={state}
      variants={reduceMotion ? fade : screen}
      className="border-border/80 bg-background-secondary/80 relative overflow-hidden rounded-3xl border shadow-[0_40px_120px_-40px_rgb(229_9_20/0.45)] backdrop-blur-md"
    >
      <motion.div variants={reduceMotion ? fade : content} className="relative">
        {children}
      </motion.div>

      {!reduceMotion && (
        <>
          {/* Linhas de varredura de tela antiga */}
          <motion.div
            aria-hidden
            variants={scanlines}
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.06)_0px,rgb(255_255_255/0.06)_1px,transparent_1px,transparent_4px)]"
          />
          {/* Clarão ao ligar */}
          <motion.div
            aria-hidden
            variants={flash}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#FFE1E2,#FF343B_45%,#85080E)]"
          />
        </>
      )}
    </motion.div>
  )
}

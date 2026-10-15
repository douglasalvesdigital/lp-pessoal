"use client"

import type { ReactNode } from "react"
import { motion, type Variants } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { NeuralSphere } from "@/components/neural-sphere"
import { cn } from "@/lib/utils"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

/** `footer` fica na base da primeira dobra (ex.: carrossel de tecnologias). */
export function Hero({ footer }: { footer?: ReactNode }) {
  return (
    <section className="glow-top-right-soft lg:glow-top-right relative isolate flex min-h-svh flex-col overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 pt-28 pb-12 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-20 lg:pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.h1
            variants={item}
            className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Transformando desafios em{" "}
            <span className="text-red-light glow-text-red">
              soluções digitais.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg"
          >
            Desenvolvimento web, integrações e automação com IA. Da estratégia
            ao código, construo soluções com foco em performance, eficiência e
            resultados.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <a
              href="#projetos"
              className={cn(
                buttonVariants(),
                "hover:bg-red-light h-11 px-5 text-sm hover:shadow-[0_8px_32px_-8px_rgb(255_52_59/0.6)]"
              )}
            >
              Explorar projetos
              <ArrowUpRight className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </a>
            <a
              href="#sobre"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hover:border-foreground/30 h-11 bg-transparent px-5 text-sm"
              )}
            >
              Sobre mim
            </a>
          </motion.div>
        </motion.div>

        {/* Celular: a esfera vira fundo translúcido atrás do texto, liberando
            espaço para as logos aparecerem na primeira dobra.
            Desktop (lg:contents): o wrapper some e a esfera volta à coluna da direita. */}
        <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 flex justify-center opacity-30 lg:pointer-events-auto lg:contents">
          <NeuralSphere className="w-[115%] max-w-[560px] shrink-0 lg:-mt-4 lg:w-[110%] lg:max-w-[680px] lg:shrink lg:translate-x-[6%] lg:self-start lg:justify-self-end" />
        </div>
      </div>

      {footer}
    </section>
  )
}

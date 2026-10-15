"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion, type Variants } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { WhatsappIcon } from "@/components/brand-icons"
import { NeuralSphere } from "@/components/neural-sphere"
import { StatBubble } from "@/components/stat-bubble"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

// Sem opacity 0: o texto aparece no primeiro paint, mesmo antes do JS
const item: Variants = {
  hidden: { y: 16 },
  show: { y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

/** `footer` fica na base da primeira dobra (ex.: carrossel de tecnologias). */
export function Hero({ footer }: { footer?: ReactNode }) {
  return (
    <section className="glow-top-right-soft lg:glow-top-right relative isolate flex min-h-svh flex-col overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 px-6 pt-24 pb-14 lg:grid-cols-[1fr_auto] lg:gap-10 xl:grid-cols-[1.05fr_1fr] xl:gap-4 lg:px-8 lg:pt-24 lg:pb-16">
        {/* Texto — no celular vem depois da foto */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 max-w-xl lg:order-1 lg:max-w-[30rem] xl:max-w-xl"
        >
          <motion.h1
            variants={item}
            className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.15rem]"
          >
            Sites, integrações e automação com IA.{" "}
            <span className="text-red-light glow-text-red">Sem enrolação.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg"
          >
            Sou o Jedson, desenvolvedor full stack. Crio sites, sistemas e
            automações para marcas, agências e times de produto. Hoje estou
            aberto a novos projetos, freelas e boas oportunidades.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projetos"
              className={cn(
                buttonVariants(),
                "hover:bg-red-light h-11 px-5 text-sm hover:shadow-[0_8px_32px_-8px_rgb(255_52_59/0.6)]",
              )}
            >
              Ver meus projetos
              <ArrowUpRight className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hover:border-foreground/30 h-11 bg-transparent px-5 text-sm",
              )}
            >
              <WhatsappIcon className="size-4" />
              Chamar no WhatsApp
            </a>
          </motion.div>
        </motion.div>

        <Portrait />
      </div>

      {footer}
    </section>
  )
}

/** Foto em destaque, com a esfera de sinapses viva atrás. */
function Portrait() {
  return (
    <div className="relative order-1 mx-auto w-full max-w-[400px] self-center sm:max-w-[440px] lg:order-2 lg:w-[420px] lg:max-w-none lg:justify-self-end xl:w-full xl:max-w-[520px]">
      {/* Esfera de sinapses: o "cérebro" atrás da cabeça. A foto não captura o
          mouse, então a esfera continua reagindo ao hover. */}
      <NeuralSphere className="absolute top-[-18%] left-1/2 w-[135%] max-w-none -translate-x-1/2 opacity-70 lg:top-[-24%] lg:w-[150%] lg:opacity-90" />

      <motion.div
        initial={false}
        className="hero-rise pointer-events-none relative"
      >
        <Image
          src="/jed-foto.png"
          alt="Jedson Santos, desenvolvedor full stack"
          width={1122}
          height={1358}
          preload
          sizes="(min-width: 1280px) 520px, (min-width: 1024px) 420px, (min-width: 640px) 440px, 400px"
          className="h-auto w-full drop-shadow-[0_0_60px_rgb(229_9_20/0.25)] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_70%,transparent_99%),linear-gradient(to_right,transparent_0%,black_16%,black_84%,transparent_100%)]"
        />
      </motion.div>

      {/* Números em destaque */}
      <StatBubble
        className="top-[24%] -right-1 sm:-right-6"
        value="4+ anos"
        label="full stack"
      />
      <StatBubble
        className="top-[52%] -left-2 sm:-left-10 lg:-left-4 xl:-left-10 [animation-delay:-2s]"
        value="80+ projetos"
        label="entregues"
        accent
      />
    </div>
  )
}

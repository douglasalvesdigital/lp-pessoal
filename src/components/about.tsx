import Image from "next/image"
import { ArrowUpRight, Download, GraduationCap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

export function About() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-5">
          <Portrait />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-muted-foreground text-sm tracking-[0.12em]">
              quem está por trás do código?
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Olá, sou Jedson. Uso IA para ir{" "}
              <span className="text-red-light glow-text-red">
                mais longe e mais rápido.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
              Desenvolvedor full stack que vai além do código: entendo o
              desafio, escolho a tecnologia certa e uso IA para acelerar a
              entrega,{" "}
              <span className="text-foreground">sem abrir mão da qualidade.</span>
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <blockquote className="border-red-primary mt-10 max-w-xl border-l-2 pl-5 text-lg leading-snug font-medium text-balance">
              Boas soluções não começam pela tecnologia mais complexa, mas pela
              escolha certa para cada problema.
            </blockquote>
          </Reveal>

          <Reveal
            delay={0.2}
            className="border-border mt-12 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-muted-foreground flex items-start gap-2.5 text-sm">
              <GraduationCap className="mt-0.5 size-4 shrink-0" />
              <span>
                Análise e Desenvolvimento de Sistemas · Multi-agentes (StartSe)
              </span>
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              {site.resume && (
                <a
                  href={site.resume}
                  download
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "hover:border-foreground/30 h-11 bg-transparent px-5 text-sm"
                  )}
                >
                  <Download />
                  Baixar currículo
                </a>
              )}
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "hover:bg-red-light h-11 px-5 text-sm hover:shadow-[0_8px_32px_-8px_rgb(255_52_59/0.6)]"
                )}
              >
                Vamos conversar
                <ArrowUpRight className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Portrait() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Brilho difuso atrás da foto: cor sólida + blur, sem bordas visíveis */}
      <div
        aria-hidden
        className="bg-red-dark/50 absolute top-[14%] left-1/2 aspect-square w-[95%] -translate-x-1/2 rounded-full blur-[90px]"
      />
      <div
        aria-hidden
        className="bg-red-primary/30 absolute top-[18%] left-1/2 aspect-square w-[50%] -translate-x-1/2 rounded-full blur-[70px]"
      />

      <Image
        src="/jed-foto.png"
        alt="Jedson Santos, desenvolvedor full stack"
        width={1122}
        height={1342}
        sizes="(min-width: 640px) 448px, 90vw"
        className="relative h-auto w-full [mask-image:linear-gradient(to_bottom,black_70%,transparent_97%)]"
      />

      {/* Destaques flutuantes */}
      <Stat
        className="top-[20%] -right-2 sm:-right-8"
        value="+4 anos"
        label="full stack"
      />
      <Stat
        className="top-[55%] -left-2 sm:-left-10 [animation-delay:-2s]"
        value="80+ projetos"
        label="entregues"
        accent
      />
      <Stat
        className="right-0 bottom-[16%] sm:-right-6 [animation-delay:-4s]"
        value="40% mais rápido"
        label="com design system"
      />
    </div>
  )
}

function Stat({
  value,
  label,
  accent,
  className,
}: {
  value: string
  label: string
  accent?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-border/80 bg-background-secondary/75 absolute animate-[float_6s_ease-in-out_infinite] rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md motion-reduce:animate-none",
        className
      )}
    >
      <p
        className={cn(
          "text-xl leading-none font-semibold tracking-tight",
          accent && "text-red-light glow-text-red"
        )}
      >
        {value}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  )
}

import { ArrowUpRight, Download, GraduationCap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const process = [
  {
    title: "Entender",
    text: "Antes de abrir o editor, entendo o negócio, quem vai usar e o que precisa dar certo.",
  },
  {
    title: "Escolher o caminho",
    text: "A tecnologia certa para o problema, não a mais nova nem a mais complexa.",
  },
  {
    title: "Construir",
    text: "Código limpo e bem organizado. A IA acelera o repetitivo, e eu reviso tudo.",
  },
  {
    title: "Entregar e acompanhar",
    text: "Site no ar, rápido e fácil de editar. E eu continuo por perto depois.",
  },
]

export function About() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="text-muted-foreground text-sm tracking-[0.12em]">
              sobre mim
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Antes de escrever código,{" "}
              <span className="text-red-light glow-text-red">
                eu quero entender o problema.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
              Trabalho do front ao back, sozinho ou junto do time: em agência,
              como freela ou dentro de produto. A IA fica com o trabalho
              repetitivo, e eu fico com o que importa:{" "}
              <span className="text-foreground">pensar bem a solução.</span>
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
            className="border-border mt-12 flex flex-col gap-6 border-t pt-8"
          >
            <p className="text-muted-foreground flex items-start gap-2.5 text-sm">
              <GraduationCap className="mt-0.5 size-4 shrink-0" />
              <span>
                Análise e Desenvolvimento de Sistemas · Multi-agentes (StartSe)
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
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
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.1}>
            <p className="text-muted-foreground text-sm tracking-[0.12em]">
              como eu trabalho
            </p>
          </Reveal>

          {/* Processo: passos ligados por uma linha neural */}
          <ol className="relative mt-6 space-y-4">
            <span
              aria-hidden
              className="from-red-primary/70 via-border to-border absolute top-3 bottom-3 left-[19px] w-px bg-gradient-to-b"
            />
            {process.map((step, i) => (
              <Reveal key={step.title} delay={0.15 + i * 0.08}>
                <li className="group/step relative flex gap-5">
                  <span
                    className={cn(
                      "bg-background-secondary relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-[border-color,box-shadow,color] duration-300",
                      i === 0
                        ? "border-red-primary/70 text-red-light shadow-[0_0_20px_-4px_rgb(229_9_20/0.7)]"
                        : "border-border text-muted-foreground group-hover/step:border-red-primary/60 group-hover/step:text-red-light group-hover/step:shadow-[0_0_20px_-4px_rgb(229_9_20/0.6)]"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="border-border/70 bg-background-secondary/50 group-hover/step:border-foreground/15 flex-1 rounded-2xl border p-5 backdrop-blur-sm transition-colors">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

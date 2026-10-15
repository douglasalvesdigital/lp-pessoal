import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/brand-icons"
import { ContactScreen } from "@/components/contact-screen"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const outline = cn(
  buttonVariants({ variant: "outline" }),
  "hover:border-foreground/30 h-12 bg-background/40 px-6 text-sm backdrop-blur-sm",
)

export function Contact() {
  return (
    <section
      id="contato"
      className="relative isolate overflow-hidden pt-16 pb-28 lg:pt-20 lg:pb-32"
    >
      {/* Horizonte: brilho subindo da base + linha de luz que encontra o footer */}
      <div
        aria-hidden
        className="bg-red-dark/50 pointer-events-none absolute -bottom-48 left-1/2 -z-10 h-96 w-[70rem] max-w-[140%] -translate-x-1/2 rounded-[100%] blur-[110px]"
      />
      <div
        aria-hidden
        className="bg-red-primary/30 pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-48 w-[32rem] max-w-full -translate-x-1/2 rounded-[100%] blur-[80px]"
      />
      <div
        aria-hidden
        className="via-red-light/70 pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />

      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Wrapper sem transform: é aqui que o impulso de sinapse mira */}
        <div data-synapse-target>
          <ContactScreen>
            <div className="px-6 py-14 text-center sm:px-12 lg:py-20">
              <p className="text-muted-foreground text-sm tracking-[0.12em]">
                contato
              </p>
              <h2 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Tem um desafio em mente?{" "}
                <span className="text-red-light glow-text-red">
                  Vamos conversar.
                </span>
              </h2>

              <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
                Projetos, parcerias ou oportunidades: me conta o que você
                precisa e a gente encontra o melhor caminho.
              </p>

              <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "hover:bg-red-light h-12 px-6 text-sm shadow-[0_8px_32px_-10px_rgb(229_9_20/0.7)] hover:shadow-[0_8px_40px_-8px_rgb(255_52_59/0.8)]",
                  )}
                >
                  <WhatsappIcon className="size-4" />
                  Vamos conversar
                  <ArrowUpRight className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={outline}
                >
                  <LinkedinIcon className="size-4" />
                  Ver meu LinkedIn
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={outline}
                >
                  <GithubIcon className="size-4" />
                  Explorar GitHub
                </a>
              </div>
            </div>
          </ContactScreen>
        </div>
      </div>
    </section>
  )
}

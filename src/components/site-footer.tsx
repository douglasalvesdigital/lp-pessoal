import Image from "next/image"
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react"
import {
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/brand-icons"
import { PrivacyDialog } from "@/components/privacy-dialog"
import { site } from "@/lib/site"

const nav = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
]

const services = [
  "Desenvolvimento Web",
  "WordPress & ACF",
  "Integrações & Automação",
  "IA Aplicada",
]

const contacts = [
  {
    label: "WhatsApp",
    detail: site.phone,
    href: site.whatsapp,
    icon: WhatsappIcon,
  },
  {
    label: "LinkedIn",
    detail: "Jedson Santos",
    href: site.linkedin,
    icon: LinkedinIcon,
  },
  { label: "GitHub", detail: "@jedslim", href: site.github, icon: GithubIcon },
  ...(site.email
    ? [
        {
          label: "E-mail",
          detail: site.email,
          href: `mailto:${site.email}`,
          icon: Mail,
        },
      ]
    : []),
]

const heading = "text-muted-foreground mb-5 text-xs tracking-[0.12em] uppercase"

export function SiteFooter() {
  return (
    <footer className="border-border/70 relative isolate overflow-hidden border-t">
      {/* Filete de luz no topo, continuando o horizonte do contato */}
      <div
        aria-hidden
        className="via-red-light/60 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-8">
          {/* Marca */}
          <div className="col-span-2 lg:col-span-5">
            <Image
              src="/logo-jedtec.png"
              alt="JEDTEC"
              width={1950}
              height={230}
              sizes="220px"
              className="h-7 w-auto"
            />
            <p className="text-muted-foreground mt-5 max-w-sm leading-relaxed">
              Menos hype.{" "}
              <span className="text-foreground">Mais aplicação.</span>{" "}
              Desenvolvimento web, integrações e IA aplicada para marcas que
              precisam de resultado.
            </p>

            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:border-red-primary/50 group/cta mt-8 inline-flex items-center gap-3 rounded-full border py-2 pr-4 pl-2 text-sm transition-colors"
            >
              <span className="bg-red-primary flex size-8 items-center justify-center rounded-full shadow-[0_0_16px_-2px_rgb(229_9_20/0.8)]">
                <WhatsappIcon className="size-4" />
              </span>
              Vamos tirar sua ideia do papel
              <ArrowUpRight className="text-muted-foreground group-hover/cta:text-foreground size-4 transition-[color,transform] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            </a>

            <p className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Disponível para novos projetos
            </p>
          </div>

          {/* Navegação */}
          <nav aria-label="Rodapé" className="lg:col-span-2">
            <p className={heading}>Navegação</p>
            <ul className="space-y-3 text-sm">
              {nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-foreground/80 hover:text-red-light transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Serviços */}
          <div className="lg:col-span-2">
            <p className={heading}>Serviços</p>
            <ul className="text-foreground/80 space-y-3 text-sm">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="col-span-2 lg:col-span-3">
            <p className={heading}>Contato</p>
            <ul className="space-y-3">
              {contacts.map(({ label, detail, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-3 text-sm"
                  >
                    <span className="border-border bg-background-secondary text-muted-foreground group-hover/link:border-red-primary/50 group-hover/link:text-red-light flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-muted-foreground block text-xs">
                        {label}
                      </span>
                      <span className="text-foreground/90 group-hover/link:text-foreground block truncate">
                        {detail}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barra final */}
        <div className="border-border/70 mt-16 flex flex-col gap-4 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p>© 2026 {site.name}. Todos os direitos reservados.</p>
            <span aria-hidden className="text-muted-foreground/40 hidden sm:inline">
              ·
            </span>
            <PrivacyDialog className="hover:text-red-light w-fit cursor-pointer text-left underline-offset-4 transition-colors hover:underline" />
          </div>
          <div className="text-muted-foreground flex items-center gap-6">
            <a
              href="#"
              aria-label="Voltar ao topo"
              className="border-border hover:border-red-primary/50 hover:text-foreground flex size-9 items-center justify-center rounded-full border transition-colors"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>

    </footer>
  )
}

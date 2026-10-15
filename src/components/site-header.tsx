"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/brand-icons"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const links = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)

  // Fundo do header aparece depois de rolar um pouco
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Destaca no menu a seção que está no meio da tela
  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Menu do celular: trava a rolagem e fecha com Esc
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.documentElement.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    // Acima da faixa de projetos (z-50) e do fundo desfocado (z-40)
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] px-4 pt-3 sm:px-6 lg:px-8 lg:pt-5">
      {/* Barra flutuante dentro da grid, com vidro espelhado */}
      <div
        className={cn(
          "pointer-events-auto relative mx-auto max-w-7xl overflow-hidden rounded-2xl border backdrop-blur-xl backdrop-saturate-150",
          "transition-[background-color,border-color,box-shadow] duration-500",
          scrolled || open
            ? "border-white/10 bg-background/55 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.08)]"
            : "border-white/[0.06] bg-white/[0.03] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]",
        )}
      >
        {/* Reflexo: brilho diagonal suave no topo do vidro */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.07)_0%,transparent_35%,transparent_70%,rgb(255_52_59/0.06)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <div className="relative flex h-14 items-center justify-between gap-6 px-4 sm:px-5 lg:h-16 lg:px-6">
          <Link
            href="/"
            aria-label="JEDTEC — página inicial"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/logo-jedtec.png"
              alt="JEDTEC"
              width={1950}
              height={230}
              preload
              sizes="200px"
              className="h-5 w-auto sm:h-6"
            />
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current === link.href ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm transition-colors",
                      current === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {current === link.href && (
                      <motion.span
                        layoutId="nav-dot"
                        className="bg-red-primary absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full shadow-[0_0_8px_1px_rgb(255_52_59/0.7)]"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants(),
                "hover:bg-red-light hidden h-9 px-4 text-sm sm:inline-flex",
              )}
            >
              Vamos conversar
              <ArrowUpRight />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="border-border flex size-10 items-center justify-center rounded-full border md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={open}
        current={current}
        onClose={() => setOpen(false)}
      />
    </header>
  )
}

/* ---------- Menu do celular: gaveta lateral ---------- */

const drawerList: Variants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  closed: {},
}

const drawerItem: Variants = {
  open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  closed: { opacity: 0, x: 24 },
}

function MobileDrawer({
  open,
  current,
  onClose,
}: {
  open: boolean
  current: string | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="pointer-events-auto fixed inset-0 z-[70] md:hidden">
          {/* Fundo escurecido: toque fora fecha */}
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.nav
            id="menu-mobile"
            aria-label="Principal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="border-border/80 bg-background-secondary/95 absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-hidden border-l shadow-[-30px_0_80px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl"
          >
            {/* Glow da marca no topo da gaveta */}
            <div
              aria-hidden
              className="bg-red-dark/50 pointer-events-none absolute -top-32 -right-24 size-80 rounded-full blur-[90px]"
            />
            <div
              aria-hidden
              className="via-red-light/50 pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent to-transparent"
            />

            <div className="relative flex h-[4.25rem] items-center justify-between px-6">
              <span className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
                className="border-border hover:border-red-primary/50 flex size-10 items-center justify-center rounded-full border transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <motion.ul
              variants={drawerList}
              initial="closed"
              animate="open"
              className="relative flex-1 px-6 pt-4"
            >
              {links.map((link, i) => {
                const active = current === link.href
                return (
                  <motion.li key={link.href} variants={drawerItem}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? "true" : undefined}
                      className="group/item border-border/60 flex items-center gap-4 border-b py-5"
                    >
                      <span
                        className={cn(
                          "font-mono text-xs",
                          active
                            ? "text-red-light"
                            : "text-muted-foreground/60",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-3xl font-semibold tracking-tight transition-colors",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground group-hover/item:text-foreground",
                        )}
                      >
                        {link.label}
                      </span>
                      {active ? (
                        <span className="bg-red-primary size-2 rounded-full shadow-[0_0_10px_2px_rgb(255_52_59/0.7)]" />
                      ) : (
                        <ArrowUpRight className="text-muted-foreground/40 size-5 rotate-45 transition-transform group-hover/item:rotate-0" />
                      )}
                    </a>
                  </motion.li>
                )
              })}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="relative space-y-5 px-6 pb-8"
            >
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={cn(
                  buttonVariants(),
                  "h-12 w-full text-base shadow-[0_8px_32px_-10px_rgb(229_9_20/0.7)]",
                )}
              >
                <WhatsappIcon className="size-4" />
                Vamos conversar
                <ArrowUpRight />
              </a>

              <div className="flex items-center justify-between">
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Disponível para projetos
                </p>
                <div className="flex gap-2">
                  {[
                    {
                      href: site.linkedin,
                      label: "LinkedIn",
                      icon: LinkedinIcon,
                    },
                    { href: site.github, label: "GitHub", icon: GithubIcon },
                  ].map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="border-border text-muted-foreground hover:border-red-primary/50 hover:text-red-light flex size-9 items-center justify-center rounded-full border transition-colors"
                    >
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
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

        {/* Menu do celular */}
        <AnimatePresence>
          {open && (
            <motion.nav
              id="menu-mobile"
              aria-label="Principal"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative overflow-hidden md:hidden"
            >
              <ul className="flex flex-col gap-1 px-6 pt-2 pb-8">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "border-border/60 flex items-center justify-between border-b py-4 text-2xl font-medium tracking-tight",
                        current === link.href
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                      {current === link.href && (
                        <span className="bg-red-primary size-1.5 rounded-full" />
                      )}
                    </a>
                  </li>
                ))}
                <li className="pt-6">
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "h-12 w-full text-base")}
                  >
                    Vamos conversar
                    <ArrowUpRight />
                  </a>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

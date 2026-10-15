import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Etiqueta de seção ("SOBRE MIM ——"). Centralizada, ganha traço dos dois lados. */
export function Eyebrow({
  children,
  center = false,
  className,
}: {
  children: ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground flex items-center gap-3 text-xs tracking-[0.2em] uppercase",
        center && "justify-center",
        className,
      )}
    >
      {center && <span aria-hidden className="bg-red-primary h-px w-14" />}
      {children}
      <span aria-hidden className="bg-red-primary h-px w-14" />
    </p>
  )
}

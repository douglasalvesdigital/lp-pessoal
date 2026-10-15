import { cn } from "@/lib/utils"

/**
 * Mancha de luz vermelha desfocada. Diferente de um gradiente no fundo da
 * seção, ela pode ultrapassar os limites da seção e se dissolver na vizinha,
 * sem criar linhas de corte entre uma seção e outra.
 *
 * Posicione com classes (ex.: "-bottom-64 -left-64"). Coloque-a como primeiro
 * filho da seção (que precisa ser `relative`) para ficar atrás do conteúdo.
 */
export function Glow({
  className,
  strong = false,
}: {
  className?: string
  strong?: boolean
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-[44rem] rounded-full blur-[160px]",
        strong ? "bg-red-dark/55" : "bg-red-dark/35",
        className
      )}
    />
  )
}

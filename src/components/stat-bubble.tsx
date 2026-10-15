import { cn } from "@/lib/utils"

/** Balão flutuante com um número de destaque (ex.: "+4 anos · full stack"). */
export function StatBubble({
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

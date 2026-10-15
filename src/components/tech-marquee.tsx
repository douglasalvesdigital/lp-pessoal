import {
  siClaude,
  siFigma,
  siGithub,
  siMysql,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siReact,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWordpress,
  type SimpleIcon,
} from "simple-icons"

const technologies: SimpleIcon[] = [
  siNextdotjs,
  siReact,
  siTypescript,
  siTailwindcss,
  siShadcnui,
  siNodedotjs,
  siPhp,
  siWordpress,
  siMysql,
  siSupabase,
  siN8n,
  siClaude,
  siGithub,
  siVercel,
  siFigma,
]

function TechLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <li className="text-muted-foreground/45 hover:text-foreground flex shrink-0 cursor-default items-center gap-3 transition-[color,filter] duration-300 hover:drop-shadow-[0_0_12px_rgb(245_245_245/0.45)]">
      <svg
        role="img"
        viewBox="0 0 24 24"
        aria-hidden
        className="size-8 fill-current"
      >
        <path d={icon.path} />
      </svg>
      <span className="text-2xl font-semibold tracking-tight whitespace-nowrap">
        {icon.title}
      </span>
    </li>
  )
}

export function TechMarquee() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8">
      <p className="text-muted-foreground mb-8 text-center text-sm tracking-[0.12em]">
        tecnologias que fazem parte do meu dia a dia
      </p>

      {/* Contido na largura do conteúdo: as logos somem antes das bordas da tela */}
      <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        {/* Duas cópias da lista: a animação desloca uma largura inteira e reinicia sem emenda */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="animate-marquee flex shrink-0 items-center gap-20 py-3 pr-20 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          >
            {technologies.map((icon) => (
              <TechLogo key={icon.slug} icon={icon} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

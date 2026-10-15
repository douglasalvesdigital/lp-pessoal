import type { Project } from "@/components/project-card"
import { ProjectsCarousel } from "@/components/projects-carousel"
import { ProjectsMarquee } from "@/components/projects-marquee"
import { Glow } from "@/components/glow"
import { Reveal } from "@/components/reveal"

const projects: Project[] = [
  {
    name: "EZTEC",
    segment: "Mercado imobiliário",
    description:
      "Portal de imóveis de uma das maiores incorporadoras de São Paulo, com lançamentos, obras e prontos para morar. Front em Next.js consumindo WordPress headless, com conteúdo gerenciado via ACF.",
    tags: ["Next.js", "React", "WordPress headless", "ACF", "REST API"],
    image: "/projetos/eztec.jpg",
    preview: {
      url: "https://www.eztec.com.br/",
      video: {
        webm: "/projetos/eztec.webm",
        mp4: "/projetos/eztec.mp4",
      },
    },
    url: "https://www.eztec.com.br/",
    agency: "Agência ILI",
  },
  {
    name: "Banijay Studios",
    segment: "Audiovisual",
    description:
      "Participação no desenvolvimento de uma experiência web para o setor audiovisual, com foco na implementação técnica e na experiência do usuário.",
    tags: ["WordPress", "PHP", "JavaScript"],
    image: "/projetos/banijay.jpg",
    preview: {
      url: "https://banijayestudios.com.br/",
      video: {
        webm: "/projetos/banijay.webm",
        mp4: "/projetos/banijay.mp4",
      },
    },
    url: "https://banijayestudios.com.br/",
    agency: "Agência ILI",
  },
  {
    name: "A Fábrica",
    segment: "Audiovisual",
    description:
      "Site da produtora de filmes e séries para TV e streaming do grupo Banijay, com vitrine dos projetos, catálogo e novidades.",
    tags: ["WordPress", "PHP", "JavaScript"],
    image: "/projetos/afabrica.jpg",
    preview: {
      url: "https://afabrica.etc.br/",
      video: {
        webm: "/projetos/afabrica.webm",
        mp4: "/projetos/afabrica.mp4",
      },
    },
    url: "https://afabrica.etc.br/",
    agency: "Agência ILI",
  },
  {
    name: "Verso Investimentos",
    segment: "Mercado financeiro",
    description:
      "Projeto digital voltado ao segmento financeiro, com foco em apresentação de serviços e experiência web.",
    tags: [],
    image: "/projetos/verso.jpg",
    preview: {
      url: "https://versoinvestimentos.com.br/",
      video: {
        webm: "/projetos/verso.webm",
        mp4: "/projetos/verso.mp4",
      },
    },
    url: "https://versoinvestimentos.com.br/",
    agency: "Agência ILI",
  },
  {
    name: "Intex Bank",
    segment: "Câmbio & Finanças",
    description:
      "Site de um banco de câmbio para empresas, com soluções de câmbio comercial, hedge e remessas internacionais, e conteúdo próprio de insights.",
    tags: ["WordPress", "PHP", "JavaScript"],
    image: "/projetos/intex.jpg",
    preview: {
      url: "https://intexbank.com.br/",
      video: {
        webm: "/projetos/intex.webm",
        mp4: "/projetos/intex.mp4",
      },
    },
    url: "https://intexbank.com.br/",
    agency: "Agência ILI",
  },
  {
    name: "S-Dot",
    segment: "Design & Embalagens",
    description:
      "Site de uma agência de design estratégico de marcas e embalagens, com vitrine de cases para clientes como Coca-Cola, Lobits e MasterCook.",
    tags: ["WordPress", "PHP", "JavaScript"],
    image: "/projetos/s-dot.jpg",
    preview: {
      url: "https://s-dot.com.br/",
      video: {
        webm: "/projetos/s-dot.webm",
        mp4: "/projetos/s-dot.mp4",
      },
    },
    url: "https://s-dot.com.br/",
    agency: "Agência ILI",
  },
  {
    name: "Vans Mil",
    segment: "Transporte",
    description:
      "Desenvolvimento e evolução de uma plataforma web para serviços de transporte, com foco em funcionalidades, experiência do usuário e presença digital.",
    tags: ["WordPress", "PHP", "JavaScript", "SEO"],
    image: "/projetos/vans-mil.jpg",
    preview: {
      url: "https://vansmil.com.br/",
      video: {
        webm: "/projetos/vans-mil.webm",
        mp4: "/projetos/vans-mil.mp4",
      },
    },
    url: "https://vansmil.com.br/",
  },
  {
    name: "Ferradura Resort",
    segment: "Hotelaria & Turismo",
    description:
      "Soluções web para hotelaria e turismo, envolvendo arquitetura de conteúdo, WordPress, integrações e experiência digital.",
    tags: ["WordPress", "PHP", "ACF", "APIs"],
    image: "/projetos/ferradura.jpg",
    preview: {
      url: "https://ferradurahotel.com.br/resort/",
      video: {
        webm: "/projetos/ferradura.webm",
        mp4: "/projetos/ferradura.mp4",
      },
    },
  },
  {
    name: "Ferradura Private",
    segment: "Hotelaria boutique",
    description:
      "Site do hotel boutique do grupo Ferradura em Búzios: suítes exclusivas, pacotes e casamentos, com identidade própria e reserva integrada.",
    tags: ["WordPress", "PHP", "ACF", "APIs"],
    image: "/projetos/ferradura-private.jpg",
    preview: {
      url: "https://ferradurahotel.com.br/ferradura-private/",
      video: {
        webm: "/projetos/ferradura-private.webm",
        mp4: "/projetos/ferradura-private.mp4",
      },
    },
  },
  {
    name: "Chef Victoria Teles",
    segment: "Gastronomia & Hospitalidade",
    description:
      "Landing page profissional para consultoria gastronômica e experiências sob medida, com foco em posicionamento e contato direto pelo WhatsApp.",
    tags: ["Landing page", "SEO", "Conversão"],
    image: "/projetos/victoria-teles.jpg",
    preview: {
      url: "https://porvictoriateles.com.br/",
      video: {
        webm: "/projetos/victoria-teles.webm",
        mp4: "/projetos/victoria-teles.mp4",
      },
    },
    url: "https://porvictoriateles.com.br/",
  },
]

export function Projects() {
  return (
    <section id="projetos" className="relative pt-20 pb-24 lg:pt-28 lg:pb-32">
      {/* Luz que vem da seção anterior e se dissolve aqui */}
      <Glow strong className="-top-72 -right-64" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-muted-foreground text-sm tracking-[0.12em]">
              projetos
            </p>
            <h2 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
              Projetos que entreguei
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed sm:text-right">
            Uma seleção entre os mais de 80 que já coloquei no ar.
          </p>
        </Reveal>
      </div>

      {/* Sem Reveal: o transform dele impediria a faixa de ficar acima da máscara */}
      {/* Desktop/tablet: faixa contínua. Celular: carrossel parado com setas */}
      <div className="mt-10 hidden md:block">
        <ProjectsMarquee projects={projects} />
      </div>
      <div className="mt-10 md:hidden">
        <ProjectsCarousel projects={projects} />
      </div>
    </section>
  )
}

import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Specialties } from "@/components/specialties"
import { SynapseTrail } from "@/components/synapse-trail"
import { TechMarquee } from "@/components/tech-marquee"
import { site } from "@/lib/site"

/** Dados estruturados (schema.org) para o Google entender quem é o site. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/jed-foto.png`,
  jobTitle: "Desenvolvedor Full Stack",
  description: site.description,
  brand: { "@type": "Brand", name: "JEDTEC" },
  knowsAbout: [
    "Desenvolvimento web",
    "Next.js",
    "React",
    "WordPress",
    "Integrações de APIs",
    "Automação",
    "Inteligência Artificial",
  ],
  sameAs: [site.linkedin, site.github],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      {/* relative: referência do impulso de sinapse que percorre as seções */}
      <main className="relative">
        <SynapseTrail />
        <Hero footer={<TechMarquee />} />
        <Specialties />
        <Projects />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}

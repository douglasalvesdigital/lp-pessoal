import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Specialties } from "@/components/specialties"
import { SynapseTrail } from "@/components/synapse-trail"
import { TechMarquee } from "@/components/tech-marquee"

export default function Home() {
  return (
    <>
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

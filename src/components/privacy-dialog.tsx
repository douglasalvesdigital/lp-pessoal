"use client"

import type { ReactNode } from "react"
import { ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { site } from "@/lib/site"

const UPDATED_AT = "outubro de 2026"

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      <div className="text-muted-foreground space-y-2 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

const link = "text-red-light hover:text-foreground underline underline-offset-4"

export function PrivacyDialog({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger className={className}>Política de privacidade</DialogTrigger>

      <DialogContent className="bg-background-secondary border-border flex max-h-[85svh] flex-col gap-0 overflow-hidden border p-0 sm:max-w-2xl">
        <DialogHeader className="border-border/70 border-b p-6 pr-14">
          <div className="text-red-light mb-2 flex items-center gap-2 text-xs tracking-[0.12em] uppercase">
            <ShieldCheck className="size-4" />
            LGPD
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Política de privacidade
          </DialogTitle>
          <DialogDescription>
            Última atualização: {UPDATED_AT}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto p-6 text-sm">
          <p className="text-muted-foreground leading-relaxed">
            Esta política explica como este site trata informações pessoais, em
            conformidade com a Lei Geral de Proteção de Dados (Lei nº
            13.709/2018, a LGPD).
          </p>

          <Section title="1. Quem é o responsável">
            <p>
              Este site é mantido por {site.name}, desenvolvedor full stack,
              responsável pelo tratamento dos dados descritos aqui.
            </p>
          </Section>

          <Section title="2. Quais dados são coletados">
            <p>
              Este site <strong className="text-foreground">não possui formulários</strong>{" "}
              e não solicita nem armazena dados pessoais como nome, e-mail ou
              telefone. A navegação é anônima.
            </p>
          </Section>

          <Section title="3. Cookies e rastreamento">
            <p>
              Este site <strong className="text-foreground">não utiliza cookies</strong>{" "}
              e não usa ferramentas de análise, publicidade ou rastreamento
              (como Google Analytics ou pixels de redes sociais).
            </p>
          </Section>

          <Section title="4. Hospedagem">
            <p>
              O site é hospedado na Vercel. Como em qualquer servidor, podem ser
              registrados dados técnicos de acesso (como endereço IP, navegador
              e data/hora) em logs, usados apenas para segurança e
              funcionamento do serviço, conforme a{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                política de privacidade da Vercel
              </a>
              .
            </p>
          </Section>

          <Section title="5. Contato pelo WhatsApp e outros canais">
            <p>
              Ao entrar em contato pelo WhatsApp, LinkedIn ou GitHub, você
              compartilha seus dados diretamente nessas plataformas, que têm
              políticas próprias. As informações que você enviar são usadas
              somente para responder ao seu contato e conduzir uma eventual
              negociação, e não são vendidas nem compartilhadas com terceiros.
            </p>
          </Section>

          <Section title="6. Links externos">
            <p>
              O site contém links para outros sites (como os projetos do
              portfólio). Ao acessá-los, valem as políticas de privacidade de
              cada um.
            </p>
          </Section>

          <Section title="7. Seus direitos">
            <p>
              Pela LGPD, você pode solicitar a confirmação, o acesso, a correção
              ou a exclusão de dados pessoais que tenha compartilhado comigo,
              entre outros direitos previstos no art. 18 da lei.
            </p>
          </Section>

          <Section title="8. Como falar comigo">
            <p>
              Para dúvidas ou solicitações sobre privacidade, fale comigo pelo{" "}
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                WhatsApp ({site.phone})
              </a>
              {site.email && (
                <>
                  {" "}
                  ou pelo e-mail{" "}
                  <a href={`mailto:${site.email}`} className={link}>
                    {site.email}
                  </a>
                </>
              )}
              .
            </p>
          </Section>

          <Section title="9. Alterações">
            <p>
              Esta política pode ser atualizada. Se o site passar a coletar
              dados ou usar cookies, ela será revisada e, quando necessário,
              será solicitado o seu consentimento.
            </p>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

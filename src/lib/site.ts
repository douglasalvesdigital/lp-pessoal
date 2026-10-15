/** Links e contatos usados no site. */
export const site = {
  name: "Jedson Santos",
  /** Domínio de produção (sem barra no final). */
  url: "https://jedtec.com.br",
  title: "Jedson Santos — Desenvolvedor Full Stack | JEDTEC",
  description:
    "Desenvolvedor full stack com mais de 4 anos e 80+ projetos entregues. Sites e aplicações em Next.js, React e WordPress, integrações, automação e IA aplicada.",
  // Enquanto for null, o e-mail não aparece no site.
  email: null as string | null,
  phone: "+55 22 98868-7417",
  linkedin: "https://www.linkedin.com/in/jedson-santos-05a0381a1/",
  github: "https://github.com/jedslim",
  /** Destino de todos os CTAs, com mensagem já preenchida. */
  whatsapp: `https://wa.me/5522988687417?text=${encodeURIComponent(
    "Olá, Jedson! Vim pelo seu site e gostaria de conversar sobre um projeto."
  )}`,
  // Coloque o PDF em public/ e informe o caminho (ex.: "/curriculo-jedson-santos.pdf").
  // Enquanto for null, o botão "Baixar currículo" não aparece.
  resume: null as string | null,
}

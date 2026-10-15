/* eslint-disable @next/next/no-img-element -- ImageResponse (satori) só aceita <img>, não next/image */
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// Imagem exibida ao compartilhar o site (WhatsApp, LinkedIn, X, Slack...)
export const alt =
  "JEDTEC, de Jedson Santos, desenvolvedor full stack: desenvolvimento web, integrações e IA aplicada"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const toDataUri = async (file: string) =>
  `data:image/png;base64,${(await readFile(join(process.cwd(), "public", file))).toString("base64")}`

const font = (file: string) =>
  readFile(join(process.cwd(), "assets/fonts", file))

export default async function Image() {
  const [logo, photo, regular, semibold] = await Promise.all([
    toDataUri("logo-jedtec.png"),
    toDataUri("jed-foto.png"),
    font("Geist-Regular.ttf"),
    font("Geist-SemiBold.ttf"),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#030303",
          color: "#F5F5F5",
          fontFamily: "Geist",
        }}
      >
        {/* Grid fino */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow vermelho no canto superior direito */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "radial-gradient(ellipse at 88% 10%, rgba(133,8,14,0.75) 0%, rgba(72,6,9,0.35) 30%, transparent 65%)",
          }}
        />

        {/* Foto */}
        <img
          src={photo}
          alt=""
          width={470}
          height={562}
          style={{ position: "absolute", right: 40, bottom: 0 }}
        />

        {/* Conteúdo */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: 760,
            height: "100%",
          }}
        >
          <img src={logo} alt="" width={290} height={34} />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 66,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {/* Linhas explícitas: a quebra automática do satori mede alto demais */}
              <span>Sites, integrações e</span>
              <span>automação com IA.</span>
              <span style={{ color: "#FF343B" }}>Sem enrolação.</span>
            </div>
            <div
              style={{
                fontSize: 27,
                color: "#A3A3A3",
                lineHeight: 1.4,
              }}
            >
              80+ projetos no ar. Aberto a projetos, freelas e oportunidades.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#E50914",
                marginRight: 14,
                boxShadow: "0 0 12px 3px rgba(255,52,59,0.7)",
              }}
            />
            <span style={{ color: "#F5F5F5" }}>Jedson Santos</span>
            <span style={{ color: "#A3A3A3" }}>&nbsp;· Desenvolvedor Full Stack</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    }
  )
}

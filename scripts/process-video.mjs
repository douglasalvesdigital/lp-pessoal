/**
 * Prepara a gravação de tela de um projeto para a prévia de navegação.
 *
 * Uso:
 *   node scripts/process-video.mjs <entrada> <nome> [opções]
 *
 * Opções:
 *   --crop=L:A:X:Y   recorte em px (largura:altura:x:y) — tira abas, barra de tarefas etc.
 *   --start=SEG      início do trecho
 *   --end=SEG        fim do trecho
 *
 * Gera public/projetos/<nome>.mp4 (H.264) e <nome>.webm (VP9), 1200px, 30fps, sem áudio.
 * Requer ffmpeg no PATH.
 */
import { execFileSync } from "node:child_process"
import { statSync } from "node:fs"

const [input, name, ...rest] = process.argv.slice(2)
if (!input || !name) {
  console.error("Uso: node scripts/process-video.mjs <entrada> <nome> [--crop=L:A:X:Y] [--start=SEG] [--end=SEG]")
  process.exit(1)
}
const opts = Object.fromEntries(
  rest.map((arg) => arg.replace(/^--/, "").split("="))
)

const filters = [
  opts.crop && `crop=${opts.crop}`,
  "fps=30",
  "scale=1200:-2:flags=lanczos",
].filter(Boolean)

const trim = [
  ...(opts.start ? ["-ss", opts.start] : []),
  ...(opts.end ? ["-to", opts.end] : []),
]

const encoders = {
  mp4: ["-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart"],
  webm: ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good"],
}

for (const [ext, codec] of Object.entries(encoders)) {
  const out = `public/projetos/${name}.${ext}`
  execFileSync(
    "ffmpeg",
    ["-v", "error", "-y", "-i", input, ...trim, "-vf", filters.join(","), "-an", ...codec, out],
    { stdio: "inherit" }
  )
  console.log(`${out} · ${Math.round(statSync(out).size / 1024)} KB`)
}

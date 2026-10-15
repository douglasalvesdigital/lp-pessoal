/**
 * Captura a página inteira de um site para a prévia de navegação dos projetos.
 *
 * Uso: node scripts/capture-site.mjs <url> <nome>
 * Gera: public/projetos/<nome>-scroll.webp
 *
 * Usa o Chrome instalado na máquina (puppeteer-core não baixa navegador).
 * Defina CHROME_PATH se o Chrome estiver em outro lugar.
 */
import puppeteer from "puppeteer-core"
import sharp from "sharp"
import { existsSync } from "node:fs"

const [url, name] = process.argv.slice(2)
if (!url || !name) {
  console.error("Uso: node scripts/capture-site.mjs <url> <nome>")
  process.exit(1)
}

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean)
const executablePath = candidates.find((p) => existsSync(p))
if (!executablePath) {
  console.error("Chrome não encontrado. Defina CHROME_PATH.")
  process.exit(1)
}

const WIDTH = 1440
const OUTPUT_WIDTH = 1200
const MAX_HEIGHT = 12000

const browser = await puppeteer.launch({ executablePath, headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: WIDTH, height: 900 })
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 })

  // Rola até o fim para carregar lazy-load e disparar animações de entrada
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await delay(120)
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 2000))

  const height = await page.evaluate(() =>
    document.documentElement.scrollHeight
  )
  const png = await page.screenshot({
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: WIDTH, height: Math.min(height, MAX_HEIGHT) },
  })

  const out = `public/projetos/${name}-scroll.webp`
  const info = await sharp(png)
    .resize({ width: OUTPUT_WIDTH })
    .webp({ quality: 78 })
    .toFile(out)
  console.log(`${out} · ${info.width}×${info.height} · ${Math.round(info.size / 1024)} KB`)
} finally {
  await browser.close()
}

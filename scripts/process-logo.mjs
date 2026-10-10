/**
 * Novaflo brand asset pipeline.
 *
 * Source: public/brand/logo-source.png (official logo on a pure black background).
 *
 * Generates:
 *  - public/brand/novaflo-mark.png  transparent logo mark (navbar, footer, demo UI)
 *  - app/icon.png                   favicon 256×256 (transparent)
 *  - app/apple-icon.png             Apple touch icon 180×180 (navy background)
 *  - public/og.png                  1200×630 Open Graph image (navy + mark + wordmark)
 *
 * Run: npm run assets:logo   (requires the sharp devDependency)
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const SRC = "public/brand/logo-source.png";
const OUT_DIR = "public/brand";
mkdirSync(OUT_DIR, { recursive: true });

/* 1 ─ Trim the black frame around the mark */
const trimmed = await sharp(SRC)
  .trim({ background: "#000000", threshold: 24 })
  .toBuffer();
const meta = await sharp(trimmed).metadata();
console.log(`trimmed mark: ${meta.width}x${meta.height}`);

/* 2 ─ Recover true alpha: the artwork was composited over black, so
      observed = color * alpha. alpha = max(r,g,b); color /= alpha.
      This removes the background without dark halos. */
const { data, info } = await sharp(trimmed)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const ch = info.channels;
for (let i = 0; i < data.length; i += ch) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const m = Math.max(r, g, b);
  data[i + 3] = m;
  if (m > 0) {
    data[i] = Math.min(255, Math.round((r / m) * 255));
    data[i + 1] = Math.min(255, Math.round((g / m) * 255));
    data[i + 2] = Math.min(255, Math.round((b / m) * 255));
  }
}
const markPng = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

await sharp(markPng)
  .resize({ width: 480 })
  .png()
  .toFile(path.join(OUT_DIR, "novaflo-mark.png"));
console.log("✓ public/brand/novaflo-mark.png");
const markMeta = await sharp(path.join(OUT_DIR, "novaflo-mark.png")).metadata();
console.log(`  novaflo-mark.png: ${markMeta.width}x${markMeta.height}`);

/* 3 ─ Favicon: mark centred on transparent, 256×256 */
const favSize = 256;
const favPad = Math.round(favSize * 0.11);
const favMark = await sharp(markPng)
  .resize({ width: favSize - favPad * 2, height: favSize - favPad * 2, fit: "inside" })
  .png()
  .toBuffer();
await sharp({
  create: { width: favSize, height: favSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: favMark, gravity: "center" }])
  .png()
  .toFile("app/icon.png");
console.log("✓ app/icon.png");

/* 4 ─ Apple touch icon: mark on deep navy, 180×180 */
const aSize = 180;
const aPad = Math.round(aSize * 0.13);
const aMark = await sharp(markPng)
  .resize({ width: aSize - aPad * 2, height: aSize - aPad * 2, fit: "inside" })
  .png()
  .toBuffer();
await sharp({
  create: { width: aSize, height: aSize, channels: 4, background: { r: 7, g: 17, b: 31, alpha: 1 } },
})
  .composite([{ input: aMark, gravity: "center" }])
  .png()
  .toFile("app/apple-icon.png");
console.log("✓ app/apple-icon.png");

/* 5 ─ Open Graph image 1200×630 */
const W = 1200;
const H = 630;
const ogMarkW = 330;
const ogMark = await sharp(markPng)
  .resize({ width: ogMarkW })
  .png()
  .toBuffer();
const ogMarkMeta = await sharp(ogMark).metadata();
const ogSvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07111F"/>
      <stop offset="1" stop-color="#0B1220"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8B5CF6"/>
      <stop offset="0.5" stop-color="#4D8DFF"/>
      <stop offset="1" stop-color="#2AD4E8"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.74" cy="0.24" r="0.75">
      <stop offset="0" stop-color="#4D8DFF" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#4D8DFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="90" y="268" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="84" font-weight="800" fill="#FFFFFF" letter-spacing="1">Novaflo</text>
  <rect x="94" y="296" width="128" height="7" rx="3.5" fill="url(#accent)"/>
  <text x="90" y="372" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="31" fill="#9FB0C6">Make your business the trusted name</text>
  <text x="90" y="414" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="31" fill="#9FB0C6">customers remember.</text>
  <text x="90" y="536" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="23" font-weight="600" fill="#4D8DFF">Social media growth partner · Anantapur</text>
</svg>`);
await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 7, g: 17, b: 31, alpha: 1 } },
})
  .composite([
    { input: ogSvg, left: 0, top: 0 },
    {
      input: ogMark,
      left: W - ogMarkW - 90,
      top: Math.round((H - (ogMarkMeta.height ?? 240)) / 2),
    },
  ])
  .png()
  .toFile("public/og.png");
console.log("✓ public/og.png");

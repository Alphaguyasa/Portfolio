// One-off: downscale the client-supplied photography so the deployed bundle stays lean.
// next/image still re-optimises at request time; this just stops us shipping 7 MB originals.
import sharp from "sharp";
import { readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "assets");

const plan = [
  { file: "hero-portrait.jpg", width: 900, format: "jpeg" },
  { file: "about-portrait.jpg", width: 900, format: "jpeg" },
  { file: "testimonial-abdi.jpg", width: 400, format: "jpeg" },
  { file: "testimonial-melkias.jpeg", width: 400, format: "jpeg" },
];

// Source frames kept in the handoff for re-cropping; the page only uses the collages.
const unused = ["screen-today.png", "screen-ledger.png", "screen-reports.png", "screen-teach.png"];

for (const { file, width, format } of plan) {
  const src = path.join(dir, file);
  const before = (await stat(src)).size;
  const img = sharp(src).rotate().resize({ width, withoutEnlargement: true });
  const buf = await (format === "png"
    ? img.png({ compressionLevel: 9, palette: true }).toBuffer()
    : img.jpeg({ quality: 82, mozjpeg: true }).toBuffer());
  // OneDrive intermittently holds a lock on a just-synced file; replacing it needs a retry.
  for (let attempt = 1; ; attempt++) {
    try {
      await rm(src, { force: true });
      await writeFile(src, buf);
      break;
    } catch (err) {
      if (attempt >= 10) throw err;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  const after = (await stat(src)).size;
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

for (const file of unused) {
  await rm(path.join(dir, file), { force: true });
  console.log(`removed unused ${file}`);
}

console.log("\nremaining:", (await readdir(dir)).join(", "));

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Foto piu leggere: per ogni JPG/PNG in src/media/img crea versioni WebP (600 e 1200 px)
// e le usa nelle pagine con srcset, cosi il cellulare scarica la foto piccola.
const IMG_DIR = "src/media/img";
const WIDTHS = [600, 1200];
const FOTO = /\.(jpe?g|png)$/i;
const webp = (nome, w) => `/media/img/w/${nome.replace(FOTO, "")}-${w}.webp`;

export default function (cfg) {
  cfg.addTransform("foto-webp", function (html) {
    if (!(this.page.outputPath || "").endsWith(".html")) return html;
    html = html.replace(/<img\b([^>]*?)\ssrc="\/media\/img\/([^"\/]+\.(?:jpe?g|png))"([^>]*)>/gi, (tag, a, nome, b) => {
      if (/srcset=/.test(tag) || !fs.existsSync(path.join(IMG_DIR, nome))) return tag;
      const srcset = WIDTHS.map(w => `${webp(nome, w)} ${w}w`).join(", ");
      return `<img${a} src="${webp(nome, 1200)}" srcset="${srcset}" sizes="(max-width: 760px) calc(100vw - 32px), 560px"${b}>`;
    });
    return html.replace(/poster="\/media\/img\/([^"\/]+\.(?:jpe?g|png))"/gi, (t, nome) =>
      fs.existsSync(path.join(IMG_DIR, nome)) ? `poster="${webp(nome, 1200)}"` : t);
  });
  cfg.on("eleventy.after", async ({ dir }) => {
    const out = path.join(dir.output, "media/img/w");
    fs.mkdirSync(out, { recursive: true });
    const files = fs.readdirSync(IMG_DIR).filter(f => FOTO.test(f));
    await Promise.all(files.map(async f => {
      for (const w of WIDTHS) {
        const dest = path.join(dir.output, webp(f, w));
        if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs > fs.statSync(path.join(IMG_DIR, f)).mtimeMs) continue;
        await sharp(path.join(IMG_DIR, f)).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
      }
    }));
  });

  cfg.addPassthroughCopy({ "src/media": "media" });
  cfg.addPassthroughCopy({ "src/admin": "admin" });
  cfg.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  cfg.addFilter("perCategoria", (lavori, c) => lavori.filter(l => (l.categorie || []).includes(c)));
  cfg.addFilter("trovaLavoro", (lavori, slug) => lavori.find(l => l.slug === slug));
  cfg.addFilter("img", f => !f ? "" : f.startsWith("/") ? f : (f.includes("/") ? "/" + f : "/media/img/" + f));
  cfg.addFilter("vid", f => !f ? "" : f.startsWith("/") ? f : (f.includes("/") ? "/" + f : "/media/video/" + f));
  cfg.addFilter("json", v => JSON.stringify(v));
  return { dir: { input: "src", output: "_site", includes: "_includes", data: "_data" }, templateFormats: ["njk"], htmlTemplateEngine: "njk" };
}

export default function (cfg) {
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

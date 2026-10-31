import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
export default function () {
  const dir = path.resolve("content/lavori");
  return fs.readdirSync(dir).filter(f => f.endsWith(".yml"))
    .map(f => yaml.load(fs.readFileSync(path.join(dir, f), "utf8")))
    .filter(l => l && l.slug && l.pubblicato !== false)
    .sort((a, b) => (a.ordine ?? 99) - (b.ordine ?? 99));
}

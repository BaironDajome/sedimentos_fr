// scripts/convertirDat.js
import fs from "fs";
import path from "path";
import readline from "readline";
import proj4 from "proj4";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 👉 Rutas absolutas a public/
const datPath  = path.resolve(__dirname, "../public/batimetria.dat");
const jsonPath = path.resolve(__dirname, "../public/batimetria.json");

async function datToCesiumArray(
  datPath,
  { inputCrs = "EPSG:32618", outputCrs = "EPSG:4326", transform = true } = {}
) {
  const proj = transform ? proj4(inputCrs, outputCrs) : null;
  const pts  = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(datPath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const [xStr, yStr, zStr] = line.trim().split(/\s+/);
    let x = parseFloat(xStr);
    let y = parseFloat(yStr);
    const z = parseFloat(zStr);

    let lon = x, lat = y;
    if (proj) [lon, lat] = proj.inverse([x, y]);

    pts.push({ lon, lat, z });
  }
  return pts;
}

(async () => {
  const arr = await datToCesiumArray(datPath);
  fs.writeFileSync(jsonPath, JSON.stringify(arr, null, 2));
  console.log(`✔ JSON generado en ${jsonPath} con ${arr.length} puntos`);
})();

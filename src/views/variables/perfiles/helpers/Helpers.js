import proj4 from "proj4";

export async function fetchDatToCesiumArray(
  url = "/batimetria.dat",
  { inputCrs = "EPSG:32618", outputCrs = "EPSG:4326", transform = true } = {}
) {
  const text = await fetch(url).then((r) => r.text());
  const proj = transform ? proj4(inputCrs, outputCrs) : null;

  return text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [xStr, yStr, zStr] = line.trim().split(/\s+/);
      let x = parseFloat(xStr);
      let y = parseFloat(yStr);
      const z = parseFloat(zStr);
      let lon = x, lat = y;
      if (proj) [lon, lat] = proj.inverse([x, y]);
      return { lon, lat, z };
    });
}

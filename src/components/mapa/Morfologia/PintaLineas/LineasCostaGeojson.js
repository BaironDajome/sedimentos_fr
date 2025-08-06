import { useEffect } from "react";
import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export default function PintarGeoJSON({ view, url = "/linea_costa/LineaCosta.geojson" }) {
  useEffect(() => {
    if (!view || !view.map) return;

    let graphicsLayer = view.map.findLayerById("geojson-layer");
    if (graphicsLayer) {
      view.map.remove(graphicsLayer);
    }

    graphicsLayer = new GraphicsLayer({ id: "geojson-layer" });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data?.features) return;

        const features = data.features.filter(
          f => f.geometry?.type === "MultiLineString"
        );

        features.forEach((feature, index) => {
          const multiLine = feature.geometry.coordinates.map(path =>
            path.map(coord => [coord[0], coord[1]]) // Eliminar el valor Z
          );

          const polyline = new Polyline({
            paths: multiLine,
            spatialReference: { wkid: 3857 }, // EPSG:3857
          });

          const symbol = new SimpleLineSymbol({
            color: [255, 100, 0, 1],
            width: 2,
          });

          const graphic = new Graphic({
            geometry: polyline,
            symbol,
            attributes: feature.properties,
            popupTemplate: {
              title: "Línea",
              content: JSON.stringify(feature.properties),
            },
          });

          graphicsLayer.add(graphic);
        });

        view.map.add(graphicsLayer);

        // Centrar en la primera línea
        if (features[0]?.geometry?.coordinates?.[0]) {
          const allCoords = features[0].geometry.coordinates.flat();
          const extent = {
            spatialReference: { wkid: 3857 },
            xmin: Math.min(...allCoords.map(c => c[0])),
            xmax: Math.max(...allCoords.map(c => c[0])),
            ymin: Math.min(...allCoords.map(c => c[1])),
            ymax: Math.max(...allCoords.map(c => c[1])),
          };

          view.goTo(extent).catch(err =>
            console.error("Error al centrar vista en línea:", err)
          );
        }
      })
      .catch(err => console.error("Error al cargar GeoJSON:", err));

    return () => {
      if (view && view.map) {
        view.map.remove(graphicsLayer);
      }
    };
  }, [view, url]);

  return null;
}

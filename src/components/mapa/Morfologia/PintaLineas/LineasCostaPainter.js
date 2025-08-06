import { useEffect } from "react";
import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export default function PintarLineaCosta({ view, lineas='/capa.geojson' }) {
  useEffect(() => {
    console.log("Pintar Líneas de Costa:", lineas);

    // Verificación de existencia de view, view.map y lineas
    if (!view || !view.map || !lineas || lineas.length === 0) return;

    // Eliminar capa anterior si ya existe
    const oldLayer = view.map.findLayerById("lineas-costa");
    if (oldLayer) {
      view.map.remove(oldLayer);
    }

    const graphicsLayer = new GraphicsLayer({ id: "lineas-costa" });

    // Agregar cada línea de costa como gráfico
    lineas.forEach((linea, index) => {
      const polyline = new Polyline({
        paths: linea.coordinates,
        // spatialReference: { wkid: 4326 } // Datos en lat/lon (WGS84)
      });

      const graphic = new Graphic({
        geometry: polyline,
        symbol: new SimpleLineSymbol({
          color: [0, 77 + 30 * index, 255 - 30 * index, 1],
          width: 2,
        }),
        attributes: { anio: linea.anio },
        popupTemplate: {
          title: "Línea de Costa",
          content: "Año: {anio}",
        },
      });

      graphicsLayer.add(graphic);
    });

    // Agregar la nueva capa al mapa
    view.map.add(graphicsLayer);

    // Centrar vista en la primera línea
    if (lineas[0]?.coordinates?.length > 0) {
      const coords = lineas[0].coordinates.flat(2); // Asegura una lista de [lon, lat]
      const extent = {
        spatialReference: { wkid: 4326 },
        xmin: Math.min(...coords.map(p => p[0])),
        xmax: Math.max(...coords.map(p => p[0])),
        ymin: Math.min(...coords.map(p => p[1])),
        ymax: Math.max(...coords.map(p => p[1])),
      };

      view.goTo(extent).catch(err => {
        console.error("Error al centrar en la línea de costa:", err);
      });
    }

    // Limpiar al desmontar
    return () => {
      if (view && view.map && graphicsLayer) {
        view.map.remove(graphicsLayer);
      }
    };
  }, [view, lineas]);

  return null;
}

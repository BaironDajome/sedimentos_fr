import { useEffect, useRef } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";

const LAYER_PREFIX = "oleaje-";
 
export default function FlechasOleaje3D({ view }) {
  const carpeta = "/oleaje/";
  const archivosGeoJSON = [
    "20241001_0100.geojson", "20241001_0200.geojson", "20241001_0300.geojson",
    "20241001_0400.geojson", "20241001_0500.geojson", "20241001_0600.geojson",
    "20241001_0700.geojson", "20241001_0800.geojson", "20241001_0900.geojson",
    "20241001_1000.geojson", "20241001_1100.geojson", "20241001_1200.geojson",
    "20241001_1300.geojson", "20241001_1400.geojson", "20241001_1500.geojson",
    "20241001_1600.geojson", "20241001_1700.geojson", "20241001_1800.geojson",
  ];

  const sliderRef = useRef(null);
  const divRef = useRef(null);
  const urlsCreadas = useRef([]);
  const capas = useRef([]);
  const fechas = useRef([]);
  const timeSliderRef = useRef(null);
  const legendWidgetRef = useRef(null);

  useEffect(() => {
    if (!view || sliderRef.current) return;
    sliderRef.current = true;

    const cargarCapas = async () => {
      const [
        colorRendererCreator,
        histogram,
        ColorSlider,
        reactiveUtils,
        Legend
      ] = await Promise.all([
        import("@arcgis/core/smartMapping/renderers/color"),
        import("@arcgis/core/smartMapping/statistics/histogram"),
        import("@arcgis/core/widgets/smartMapping/ColorSlider"),
        import("@arcgis/core/core/reactiveUtils"),
        import("@arcgis/core/widgets/Legend"),
      ]).then(mods => mods.map(m => m.default));

      try {
        for (const archivo of archivosGeoJSON) {
          const url = carpeta + archivo;
          const nombre = archivo.replace(".geojson", "");
          const year = parseInt(nombre.slice(0, 4), 10);
          const month = parseInt(nombre.slice(4, 6), 10) - 1;
          const day = parseInt(nombre.slice(6, 8), 10);
          const hour = parseInt(nombre.slice(9, 11), 10);
          const fecha = new Date(year, month, day, hour);
          fechas.current.push(fecha);

          const res = await fetch(url);
          if (!res.ok) continue;

          const geojsonData = await res.json();
          const blob = new Blob([JSON.stringify(geojsonData)], { type: "application/json" });
          const objectURL = URL.createObjectURL(blob);
          urlsCreadas.current.push(objectURL);

          const layer = new GeoJSONLayer({
            url: objectURL,
            id: `${LAYER_PREFIX}${nombre}`,
            title: archivo,
            elevationInfo: { mode: "on-the-ground" },
            visible: false,
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-line",
                color: "white",
                width: 2,
                style: "solid",
              },
              visualVariables: [
                {
                  type: "color",
                  field: "hsign",
                  legendOptions: { title: "Altura significativa (m)" },
                  stops: [
                    { value: 0.5, color: "#2DC937", label: "< 0.5 m" },
                    { value: 1.0, color: "#E7B416", label: "1 m" },
                    { value: 1.5, color: "#DB7B2B", label: "1.5 m" },
                    { value: 2.0, color: "#CC3232", label: "2 m+" },
                  ],
                },
                {
                  type: "size",
                  field: "hsign",
                  minDataValue: 0.5,
                  maxDataValue: 2,
                  minSize: 1,
                  maxSize: 6,
                },
              ],
            },
          });

          view.map.add(layer);
          capas.current.push(layer);
        }

        if (capas.current.length === 0) return;

        await Promise.all(capas.current.map((layer) => layer.when()));
        capas.current[0].visible = true;

        // TimeSlider
        const sliderDiv = document.createElement("div");
        divRef.current = sliderDiv;

        const timeSlider = new TimeSlider({
          container: sliderDiv,
          view,
          mode: "instant",
          fullTimeExtent: {
            start: fechas.current[0],
            end: fechas.current[fechas.current.length - 1],
          },
          values: [fechas.current[0]],
          stops: { dates: fechas.current },
          playRate: 5000,
        });

        timeSlider.watch("timeExtent", (timeExtent) => {
          const actual = timeExtent?.start?.getTime();

          capas.current.forEach((layer, idx) => {
            layer.visible = fechas.current[idx].getTime() === actual;
          });

          const visibleLayer = capas.current.find(
            (layer, idx) => fechas.current[idx].getTime() === actual
          );

          // Actualizar leyenda
          if (legendWidgetRef.current && visibleLayer) {
            legendWidgetRef.current.layerInfos = [
              {
                layer: visibleLayer,
                title: "Altura significativa (m)",
              },
            ];
          }
        });

        timeSliderRef.current = timeSlider;
        view.ui.add(sliderDiv, "bottom-left");

        // Agregar leyenda inicial
        if (!legendWidgetRef.current) {
          const legend = new Legend({
            view,
            layerInfos: [
              {
                layer: capas.current[0],
                title: "Altura significativa (m)",
              },
            ],
          });
          legendWidgetRef.current = legend;
          view.ui.add(legend, "top-right");
        }

      } catch (error) {
        console.error("❌ Error al cargar capas o iniciar slider:", error);
      }
    };

    cargarCapas();

    return () => {
      if (!view || !view.map) return;

      capas.current.forEach((layer) => {
        if (view.map.findLayerById(layer.id)) {
          view.map.remove(layer);
        }
      });
      capas.current = [];

      if (divRef.current && view.ui?.remove) {
        view.ui.remove(divRef.current);
        divRef.current = null;
      }

      if (timeSliderRef.current?.destroy) {
        timeSliderRef.current.destroy();
        timeSliderRef.current = null;
      }

      if (legendWidgetRef.current) {
        view.ui.remove(legendWidgetRef.current);
        legendWidgetRef.current.destroy();
        legendWidgetRef.current = null;
      }

      urlsCreadas.current.forEach((url) => URL.revokeObjectURL(url));
      urlsCreadas.current = [];
      fechas.current = [];
      sliderRef.current = null;
    };
  }, [view]);

  return null;
}

import { useEffect, useRef } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";

const LAYER_PREFIX = "oleaje";

export default function FlechasCorriente3D({ view }) {
  const carpeta = "/oleaje/";
  const archivosGeoJSON = [
    "20241001_0100.geojson", "20241001_0200.geojson", "20241001_0300.geojson",
    "20241001_0400.geojson", "20241001_0500.geojson", "20241001_0600.geojson",
  ];

  const sliderRef = useRef(null);
  const divRef = useRef(null);
  const urlsCreadas = useRef([]);
  const capas = useRef([]);
  const fechas = useRef([]);
  const timeSliderRef = useRef(null);

  useEffect(() => {
    if (!view || sliderRef.current) return;
    sliderRef.current = true;

    const cargarCapas = async () => {
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
          if (!res.ok) {
            console.warn(`⚠️ No se pudo cargar: ${archivo} (status: ${res.status})`);
            continue;
          }

          const geojsonData = await res.json();

          const blob = new Blob([JSON.stringify(geojsonData)], { type: "application/json" });
          const objectURL = URL.createObjectURL(blob);
          urlsCreadas.current.push(objectURL);

          const layer = new GeoJSONLayer({
            url: objectURL,
            id: `${LAYER_PREFIX}${nombre}`,
            title: archivo,
            elevationInfo: { mode: "relative-to-ground", offset: 0 },
            visible: false,
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-line",
                color: "white",
                width: 2,
                style: "solid",
              },
            },
          });

          view.map.add(layer);
          capas.current.push(layer);
        }

        if (capas.current.length === 0) {
          console.warn("⚠️ No se cargó ninguna capa.");
          return;
        }

        await Promise.all(capas.current.map((layer) => layer.when()));
        capas.current[0].visible = true;

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
        });

        timeSliderRef.current = timeSlider;
        view.ui.add(sliderDiv, "bottom-left");
      } catch (error) {
        console.error("❌ Error al cargar capas o iniciar slider:", error);
      }
    };

    cargarCapas();

    return () => {
      if (!view || !view.map) {
        console.warn("⚠️ View no disponible al desmontar.");
        return;
      }

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

      urlsCreadas.current.forEach((url) => URL.revokeObjectURL(url));
      urlsCreadas.current = [];

      fechas.current = [];
      sliderRef.current = null;
    };
  }, [view]);

  return null;
}

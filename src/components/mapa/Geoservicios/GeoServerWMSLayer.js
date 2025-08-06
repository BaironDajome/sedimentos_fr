import { useEffect, useState } from "react";
import WMSLayer from "@arcgis/core/layers/WMSLayer";

const GeoServerWMSLayer = ({ view, interval = 2000 }) => {
  const dates = [
    "2107-01-00",
    "2107-01-01",
    "2107-01-02",
    "2107-01-03",
    "2107-01-04",
    "2107-01-05",
    "2107-01-06",
    "2107-01-07",
    "2107-01-08",
    "2107-01-09",
    "2107-01-10",
    "2107-01-11",
    "2107-01-12",
    "2107-01-13",
    "2107-01-14",
    "2107-01-15",
    "2107-01-16",
    "2107-01-17",
    "2107-01-18",
    "2107-01-19",
    "2107-01-20",
    "2107-01-21",
    "2107-01-22",
    "2107-01-23",
  ];

  const [wmsLayer, setWmsLayer] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!view || !view.map) return;

    // console.log(`🟢 Iniciando animación con ${dates.length} fechas.`);

    const layer = new WMSLayer({
      url: "http://localhost:8080/geoserver/Dimar/wms",
      sublayers: [
        {
          name: "Dimar:geoserver", // Asegúrate de que este nombre sea correcto
          customParameters: {
            format: "image/png",
            transparent: true,
            // time: "2107-01-16",
          },
        },
      ],
      opacity: 0.95,
      title: "🌍 Capa WMS Animada",
    });

    view.map.add(layer);
    setWmsLayer(layer);

   return () => {
      if (view.map.layers.includes(layer)) {
        view.map.remove(layer);
      }
    };
  }, [view]);

  useEffect(() => {
    if (!wmsLayer || dates.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % dates.length;
        // console.log(nextIndex);
        const newDate = dates[nextIndex];

        if (wmsLayer.sublayers && wmsLayer.sublayers.length > 0) {
          // const sublayer = wmsLayer.sublayers.getItemAt(0);
          
          // Actualiza el parámetro de tiempo
          wmsLayer.customParameters = { 
            ...wmsLayer.customParameters, 
            time: newDate
          };

         // Forzamos la actualización de la capa
          wmsLayer.load().then(() => {
            wmsLayer.refresh();
          });
        }

        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [wmsLayer, dates, interval]);

  return null;
};

export default GeoServerWMSLayer;

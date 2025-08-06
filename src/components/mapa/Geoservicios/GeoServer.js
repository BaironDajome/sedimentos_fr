import { useEffect } from "react";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

const GeoServer = ({ view }) => {
  useEffect(() => {
    if (!view || !view.map) return;

    const vtlLayer = new VectorTileLayer({
      url: "http://localhost:8080/data/salida.json"
    });
    console.log(vtlLayer);
    view.map.add(vtlLayer);

    // Esperar a que la capa se cargue
    vtlLayer.when(() => {
      console.log("VectorTileLayer cargado correctamente");
    }).catch((error) => {
      console.error("Error al cargar la capa:", error);
    });

    return () => {
      view.map.remove(vtlLayer);
    };
  }, [view]);

  return null;
};

export default GeoServer;

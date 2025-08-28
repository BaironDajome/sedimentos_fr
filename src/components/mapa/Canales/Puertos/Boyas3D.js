import React, { useContext, useEffect, useState } from "react";
import { CesiumContext } from "../../../../views/canales/perfiles/componentes/mapabase3D/Mapacesium";
import { Cartesian3, HeightReference } from "cesium";

const BATCH_SIZE = 10;     // Número de boyas que se agregan por lote
const BATCH_DELAY = 50;    // Tiempo de espera entre lotes (ms)

const Boyas3D = ({ url }) => {
  const { viewer } = useContext(CesiumContext);
  const [modelos, setModelos] = useState([]);

  // 🔹 Cargar JSON de boyas desde la URL pasada por props
  useEffect(() => {
    const cargarBoyas = async () => {
      try {
        if (!url) return; // si no hay url, no carga nada
        const res = await fetch(url);
        const data = await res.json();
        if (!Array.isArray(data.modelos)) return;
        setModelos(data.modelos);
      } catch (err) {
        console.error("Error cargando boyas:", err);
      }
    };
    cargarBoyas();
  }, [url]);

  // 🔹 Crear entidades en Cesium
  useEffect(() => {
    if (!viewer || modelos.length === 0) return;

    let isMounted = true;
    const entities = [];

    const crearBoyaBatch = async (coordenadas, modeloUrl) => {
      for (let i = 0; i < coordenadas.length; i += BATCH_SIZE) {
        if (!isMounted || !viewer || viewer.isDestroyed() || !viewer.entities) break;

        const batch = coordenadas.slice(i, i + BATCH_SIZE);

        batch.forEach(({ lon, lat }) => {
          if (!viewer.entities) return;
          const position = Cartesian3.fromDegrees(lon, lat, 0);
          const entity = viewer.entities.add({
            name: "Boya 3D",
            position,
            model: {
              uri: modeloUrl,
              minimumPixelSize: 32,
              maximumScale: 200,
              heightReference: HeightReference.CLAMP_TO_GROUND,
            },
          });
          entities.push(entity);
        });

        // 👇 Espera entre lotes para no saturar
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    };

    const ejecutarBatches = async () => {
      for (const { modeloUrl, coordenadas } of modelos) {
        if (!isMounted) break;
        await crearBoyaBatch(coordenadas, modeloUrl);
      }
    };

    ejecutarBatches();

    // 🔹 Cleanup: elimina las boyas al desmontar o cambiar URL
    return () => {
      isMounted = false;
      if (viewer && !viewer.isDestroyed() && viewer.entities) {
        entities.forEach((e) => viewer.entities.remove(e));
      }
    };
  }, [modelos, viewer]);

  return null; // No renderiza nada en React, solo en Cesium
};

export default Boyas3D;

import { useEffect, useContext } from "react";
import { Cartesian3 } from "cesium";
import { CesiumContext } from "../../../../views/canales/perfiles/componentes/mapabase3D/Mapacesium";

const LocalizacionCesium = ({ localizar = "all" }) => {
  const { viewer, isReady } = useContext(CesiumContext);

  useEffect(() => {
    console.log("LocalizacionCesium - localizar:", localizar);

    if (!viewer || !isReady) {
      console.warn("❌ Viewer no está listo todavía");
      return;
    }

    const locations = {
      tumaco: { lat: 1.8089, lon: -78.7625, height: 6000 },
      buenaventura: { lat: 3.8801, lon: -77.0312, height: 6000 },
      // 👇 "all" ya no tiene coords, lo manejamos aparte
    };

    const locationKey =
      localizar === "Todas las estaciones" || !localizar
        ? "all"
        : localizar.trim().toLowerCase();

    if (locationKey === "all") {
      console.log("🌍 Vista inicial al mundo, no mover cámara desde LocalizacionCesium");
      return;
    }

    const location = locations[locationKey];
    if (!location) {
      console.warn(`⚠️ Localización "${locationKey}" no definida`);
      return;
    }

    // ✅ Mover cámara solo si hay una localización específica
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        location.lon,
        location.lat,
        location.height
      ),
      duration: 2,
    });
  }, [viewer, isReady, localizar]);

  return null;
};

export default LocalizacionCesium;

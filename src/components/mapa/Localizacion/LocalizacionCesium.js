import { useEffect } from "react";
import { Cartesian3 } from "cesium";

const LocalizacionCesium = ({ view, localizar = "all" }) => {
  useEffect(() => {
    if (!view) return;

    // Definimos ubicaciones de los puertos
    const locations = {
      Tumaco: { lat: 1.902839, lon: -78.701652, height: 3000 },
      Buenaventura: { lat: 3.8801, lon: -77.0312, height: 3000 },
      all: { lat: 2.68, lon: -78.026, height: 8000 },
    };

    const locationKey =
      localizar === "Todas las estaciones" || !localizar ? "all" : localizar;

    const location = locations[locationKey];

    if (!location) {
      console.warn(`Localización "${locationKey}" no definida`);
      return;
    }

    // Hacemos un flyTo a la localización
    view.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        location.lon,
        location.lat,
        location.height
      ),
      duration: 2, // segundos
    });
  }, [view, localizar]);

  return null;
};

export default LocalizacionCesium;

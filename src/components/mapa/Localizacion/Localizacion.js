import { useEffect } from "react";

const Localizacion = ({ view, localizar = 'all' }) => {
  useEffect(() => {
    if (!view) return;

    view.when(() => {
      const locationKey =
        localizar === 'Todas las estaciones' || !localizar ? 'all' : localizar;

      const locations = {
        Tumaco: { lat: 1.902839, lon: -78.701652 },
        Buenaventura: { lat: 3.8801, lon: -77.0312 },
        all: { lat: 2.68, lon: -78.026 },
      };

      const location = locations[locationKey];

      if (!location) {
        console.warn(`Localización "${locationKey}" no definida`);
        return;
      }

      const zoom = locationKey === 'all' ? 7 : 11;

      view
        .goTo(
          {
            center: [location.lon, location.lat],
            zoom,
          },
          { duration: 1000 }
        )
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error("Error al centrar la vista:", err);
          }
          // Si es AbortError, lo ignoramos silenciosamente
        });
    });
  }, [view, localizar]);

  return null;
};

export default Localizacion;

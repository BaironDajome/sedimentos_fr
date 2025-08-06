import { useEffect } from "react";
import SearchWidget from "../Navegar/SearchWidget";
import GeoCombinedAnimationLayer from "../Layers/GeoCombinedAnimationLayer";
import { useBusquedaStore, useEstadosStore } from "../../../hook";

// Hooks personalizados para estado global
import "@arcgis/core/assets/esri/themes/light/main.css";

// Componente contenedor de capas y widgets de mapa
const ContenedorLayers = ({ view }) => {
  // 🔍 Obtiene la cadena de búsqueda global
  const cadena = useBusquedaStore((state) => state.cadena);
  // 🧭 Obtiene el estado de visibilidad de la capa animada
  const {ventana_layer} = useEstadosStore((state) => state.ventana_layer);

  // Efecto secundario: detectar cambios en la cadena de búsqueda
  useEffect(() => {
    if (cadena) {
      // Puedes manejar lógica de búsqueda aquí
      // console.log("Cadena de búsqueda:", cadena);
    }
  }, [cadena]);

  // Efecto secundario: detectar cambios en visibilidad de la capa
  useEffect(() => {
    //  console.log(ventana_layer);
  }, [ventana_layer]);

  return (
    <div>
      {/* Widget de búsqueda en el mapa */}
      {view && <SearchWidget view={view} />}

      {/* Capa combinada con animación: solo si está habilitada */}
      {view && ventana_layer && (
        <GeoCombinedAnimationLayer view={view} ventana_layer={ventana_layer} />
      )}

      {/* Otras capas opcionales (deshabilitadas por ahora) */}
      {/* {view && <GeoJsonPostGis view={view} />} */}
      {/* {view && <GeoServerWMSLayer view={view} />} */}
    </div>
  );
};

export default ContenedorLayers;

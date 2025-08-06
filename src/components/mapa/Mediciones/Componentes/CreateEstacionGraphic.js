// createEstacionGraphic.js
import Graphic from "@arcgis/core/Graphic";
import { createRoot } from "react-dom/client";
import { PopupTabs } from "./Popus";
import { buildCIMSymbol, getColorByPrefix } from "../Utilitis/Helper";
//import './estilos.css';
/**
 * Crea el Graphic de una estación y genera el popup con React.
 * El popup se redimensiona inmediatamente después de que React renderiza el contenido.
 */
export function CreateEstacionGraphic({ view, item }) {
  const color = getColorByPrefix(item.nombre);

  return new Graphic({
    geometry: {
      type: "point",
      longitude: item.localizacion.coordinates[0],
      latitude: item.localizacion.coordinates[1],
    },
    attributes: item,
    symbol: buildCIMSymbol(color),

    // --- POPUP ---
    popupTemplate: {
      title: `Estación: ${item.nombre}`,
      /**
       * content es una función → ArcGIS la ejecuta cuando abre el popup.
       * Devolvemos un elemento DOM que React llenará y luego redimensionamos el popup.
       */
      content: () => {
        // Contenedor donde React pintará <PopupTabs />
        const el = document.createElement("div");

        // 1️⃣ Renderizamos el componente React
        const root = createRoot(el);
         root.render(<PopupTabs datos={item} />);



        // 3️⃣ Devolvemos el nodo con el contenido
        return el;
      },
    },
  });
}

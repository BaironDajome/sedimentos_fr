import React, { useEffect, useRef } from "react";
import "@esri/calcite-components/dist/calcite/calcite.css";
import Tarjeta_Informacion_Oleaje from "./Tarjeta_Informacion_Oleaje";

// FUNCIÓN DE LIMPIEZA (puedes adaptarla a tus capas/gráficos reales)
export const cleanupCorrientes = (view) => {
  if (!view) return;

  // Eliminar capa por ID (asegúrate de usar este ID al agregar la capa)
  const layer = view.map.findLayerById("layer-corrientes");
  if (layer) {
    view.map.remove(layer);
  }

  // Limpiar gráficos si se agregaron
  if (view.graphics) {
    view.graphics.removeMany(view.graphics.items.filter((g) => g.attributes?.source === "corrientes"));
  }

  // Cancelar watchers o efectos si corresponde (esto requiere refs si usas watchers reactivos)
  // Aquí podrías agregar más lógica de limpieza
};

export default function TarjetaOleaje({ view, puertos = [], onPuertoChange, basemapRef }) {
  const chipGroupRef = useRef(null);

  useEffect(() => {
    const chipGroup = chipGroupRef.current;

    const handleChipChange = (event) => {
      const selectedChip = event.target.selectedItems?.[0];
      const value = selectedChip?.value;
      if (value && onPuertoChange) {
        onPuertoChange(value);
      }
    };

    if (chipGroup) {
      chipGroup.addEventListener("calciteChipGroupSelect", handleChipChange);
      return () => {
        chipGroup.removeEventListener("calciteChipGroupSelect", handleChipChange);
      };
    }
  }, [onPuertoChange]);

  return (
    <calcite-shell-panel slot="panel-end" display-mode="float">
      <calcite-panel heading="Capas y Corrientes">
        <calcite-accordion selection-mode="single">
          <calcite-accordion-item
            item-title="Capas base"
            description="Mapas base"
            icon-start="layers"
          >
            <div ref={basemapRef} style={{ width: "100%", height: "300px" }} />
          </calcite-accordion-item>
        </calcite-accordion>

        <calcite-block open heading="Puertos del Pacífico">
          <calcite-chip-group
            ref={chipGroupRef}
            id="puertos-chip-group"
            selection-mode="single-persist"
          >
            {puertos.map((puerto) => (
              <calcite-chip
                key={puerto.name}
                value={puerto.name}
                appearance="outline-fill"
              >
                {puerto.name}
              </calcite-chip>
            ))}
          </calcite-chip-group>
        </calcite-block>

        <Tarjeta_Informacion_Oleaje view={view} />
      </calcite-panel>
    </calcite-shell-panel>
  );
}

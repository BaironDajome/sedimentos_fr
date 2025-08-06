import React, { useEffect, useRef, useState } from "react";

// Estilos de Calcite (asegúrate de tenerlos instalados)
import "@esri/calcite-components/dist/calcite/calcite.css";

// Componente personalizado
import Tarjeta_Iformacion from "./Tarjeta_informacion";

export default function TarjetaControl({view, puertos = [], onPuertoChange, basemapRef }) {
  const chipGroupRef = useRef(null);

  // Manejador de selección de puerto
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
      <calcite-panel heading="Capas y utilidades">
        
        {/* Sección de Capas Base */}
        <calcite-accordion selection-mode="single">
          <calcite-accordion-item
            item-title="Capas base"
            description="Mapas base"
            icon-start="layers"
          >
            <div ref={basemapRef} style={{ width: "100%", height: "300px" }} />
          </calcite-accordion-item>
        </calcite-accordion>

        {/* Sección de Puertos del Pacífico */}
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
            <calcite-chip
              value="all"
              appearance="outline-fill"
            >
              C. Pacífico
            </calcite-chip>
          </calcite-chip-group>
        </calcite-block>

        {/* Tarjeta de Información Adicional */}
        <Tarjeta_Iformacion view={view}/>

      </calcite-panel>
    </calcite-shell-panel>
  );
}
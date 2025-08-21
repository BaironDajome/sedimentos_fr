import React, { useEffect, useRef } from "react";
import PointCloudControls from "./PointCloudControls";
import ControlExageracion from "./ControlExageracion";

export default function TarjetaPuertos({
  puertos = [],
  onPuertoChange,
  handleExaggerationChange,
  setPcOptions,
}) {
  const chipGroupRef = useRef(null);

  useEffect(() => {
    const chipGroup = chipGroupRef.current;

    const handleChipChange = (event) => {
      const selectedChip = event.target.selectedItems?.[0];
      const value = selectedChip?.value;
      if (value && onPuertoChange) onPuertoChange(value);
    };

    if (chipGroup) {
      chipGroup.addEventListener("calciteChipGroupSelect", handleChipChange);
      return () => {
        chipGroup.removeEventListener("calciteChipGroupSelect", handleChipChange);
      };
    }
  }, [onPuertoChange]);

  // 👉 callback para PointCloudControls
  const handleOptionsChange = (newOptions) => {
    if (setPcOptions) setPcOptions(newOptions);
  };

  // 👉 callback para Exageración y Altura Relativa
  const handleExaggerationOptionsChange = ({ exaggeration, relHeight }) => {
    if (handleExaggerationChange) {
      handleExaggerationChange({ exaggeration, relHeight });
    }
  };

  return (
    <calcite-shell-panel slot="panel-end" display-mode="float">
      <calcite-panel heading="Elevacion">
        {/* Bloque de puertos */}
        <calcite-block open heading="Puertos del Pacífico">
          <calcite-chip-group
            ref={chipGroupRef}
            id="puertos-chip-group"
            selection-mode="single-persist"
          >
            {puertos.map((puerto) => (
              <calcite-chip key={puerto.name} value={puerto.name} appearance="outline-fill">
                {puerto.name}
              </calcite-chip>
            ))}
          </calcite-chip-group>
        </calcite-block>

        <calcite-accordion selection-mode="multiple">
          {/* Accordion Exageración */}
          <calcite-accordion-item
            item-title="Exageración"
            description="Escala vertical del terreno"
            icon-start="elevation-profile"
          >
            <ControlExageracion onChange={handleExaggerationOptionsChange} />
          </calcite-accordion-item>

          {/* Accordion Point Cloud Controls */}
          <calcite-accordion-item
            item-title="Nube de puntos"
            description="Ajustes visuales"
            icon-start="3d-glasses"
          >
            <PointCloudControls onChange={handleOptionsChange} />
          </calcite-accordion-item>
        </calcite-accordion>
      </calcite-panel>
    </calcite-shell-panel>
  );
}

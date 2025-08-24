import React, { useEffect, useRef } from "react";

export default function TarjetaPuertos({
  puertos = [],
  onPuertoChange,
}) {
  const chipGroupRef = useRef(null);

  // Manejo de selección de chips
  useEffect(() => {
    const chipGroup = chipGroupRef.current;
    if (!chipGroup) return;

    const handleChipChange = (event) => {
      const selectedChip = event.target.selectedItems?.[0];
      const value = selectedChip?.value;
      if (value && onPuertoChange) onPuertoChange(value);
    };

    chipGroup.addEventListener("calciteChipGroupSelect", handleChipChange);
    return () => {
      chipGroup.removeEventListener("calciteChipGroupSelect", handleChipChange);
    };
  }, [onPuertoChange]);

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
      </calcite-panel>
    </calcite-shell-panel>
  );
}

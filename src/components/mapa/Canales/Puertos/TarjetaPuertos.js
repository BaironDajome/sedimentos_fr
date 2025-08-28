import React, { useEffect, useRef } from "react";

export default function TarjetaPuertos({
  puertos = [],
  onPuertoChange,
  onToggleBoyas,
  onToggleSedimento,
  onToggleNavegar, // 👈 nuevo callback
}) {
  const chipGroupRef = useRef(null);
  const switchBoyasRef = useRef(null);
  const switchSedimentoRef = useRef(null);
  const switchNavegarRef = useRef(null); // 👈 referencia al switch de navegar

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

  // Manejo del switch de Boyas
  useEffect(() => {
    const switchEl = switchBoyasRef.current;
    if (!switchEl) return;

    const handleSwitchChange = (event) => {
      const checked = event.target.checked;
      if (onToggleBoyas) onToggleBoyas(checked);
    };

    switchEl.addEventListener("calciteSwitchChange", handleSwitchChange);
    return () => {
      switchEl.removeEventListener("calciteSwitchChange", handleSwitchChange);
    };
  }, [onToggleBoyas]);

  // Manejo del switch de Sedimento
  useEffect(() => {
    const switchEl = switchSedimentoRef.current;
    if (!switchEl) return;

    const handleSwitchChange = (event) => {
      const checked = event.target.checked;
      if (onToggleSedimento) onToggleSedimento(checked);
    };

    switchEl.addEventListener("calciteSwitchChange", handleSwitchChange);
    return () => {
      switchEl.removeEventListener("calciteSwitchChange", handleSwitchChange);
    };
  }, [onToggleSedimento]);

  // Manejo del switch de Navegar
  useEffect(() => {
    const switchEl = switchNavegarRef.current;
    if (!switchEl) return;

    const handleSwitchChange = (event) => {
      const checked = event.target.checked;
      if (onToggleNavegar) onToggleNavegar(checked);
    };

    switchEl.addEventListener("calciteSwitchChange", handleSwitchChange);
    return () => {
      switchEl.removeEventListener("calciteSwitchChange", handleSwitchChange);
    };
  }, [onToggleNavegar]);

  return (
    <calcite-shell-panel slot="panel-end" display-mode="float">
      <calcite-panel heading="Elevación">
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

        {/* Switches de opciones */}
        <calcite-block open heading="Opciones">
          <calcite-label layout="inline">
            Mostrar Boyas
            <calcite-switch ref={switchBoyasRef}></calcite-switch>
          </calcite-label>

          <calcite-label layout="inline">
            Mostrar Sedimento
            <calcite-switch ref={switchSedimentoRef}></calcite-switch>
          </calcite-label>

          {/* 👇 Nuevo switch para Navegar */}
          <calcite-label layout="inline">
            Navegar
            <calcite-switch ref={switchNavegarRef}></calcite-switch>
          </calcite-label>
        </calcite-block>
      </calcite-panel>
    </calcite-shell-panel>
  );
}

import React, { useState, useEffect, useRef } from "react";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteSlider, CalciteLabel } from "@esri/calcite-components-react";

export default function ControlExageracion({
  initialExaggeration = 1,
  initialRelHeight = 0,
  onChange,
}) {
  const [options, setOptions] = useState({
    exaggeration: initialExaggeration,
    relHeight: initialRelHeight,
  });

  const prevOptionsRef = useRef(options);

  // Notificar al padre solo si realmente cambió
  useEffect(() => {
    const prev = prevOptionsRef.current;
    if (
      prev.exaggeration !== options.exaggeration ||
      prev.relHeight !== options.relHeight
    ) {
      prevOptionsRef.current = options;
      if (onChange) onChange(options);
    }
  }, [options, onChange]);

  const handleSliderChange = (key) => (e) => {
    const value = parseFloat(e.target.value);
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Estilos compactos para cada label
  const labelStyle = {
    fontSize: 8,
    marginBottom: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <div
      style={{
        color: "white",
        padding: 6,
        borderRadius: 8,
        width: 300,
        fontSize: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CalciteLabel style={labelStyle}>
        Exageración Z ({options.exaggeration.toFixed(2)}x)
        <CalciteSlider
          min={1}
          max={10}
          step={0.1}
          value={options.exaggeration}
          labelHandles
          onCalciteSliderInput={handleSliderChange("exaggeration")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Altura Relativa ({options.relHeight.toFixed(2)})
        <CalciteSlider
          min={0}
          max={5}
          step={0.1}
          value={options.relHeight}
          labelHandles
          onCalciteSliderInput={handleSliderChange("relHeight")}
        />
      </CalciteLabel>
    </div>
  );
}

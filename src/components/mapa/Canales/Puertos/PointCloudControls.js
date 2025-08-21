import React, { useState, useEffect } from "react";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteSlider, CalciteSwitch, CalciteLabel } from "@esri/calcite-components-react";

export default function PointCloudControls({ onChange }) {
  const [options, setOptions] = useState({
    maximumScreenSpaceError: 8,
    geometricErrorScale: 1,
    maximumAttenuation: 2,
    baseResolution: 0.1,
    eyeDomeLightingStrength: 1,
    eyeDomeLightingRadius: 1,
    attenuation: true,
    eyeDomeLighting: true,
  });

  // 👉 Notificar cambios al padre
  useEffect(() => {
    if (onChange) onChange(options);
  }, [options, onChange]);

  const handleSliderChange = (key) => (e) => {
    setOptions((prev) => ({
      ...prev,
      [key]: parseFloat(e.target.value),
    }));
  };

  const handleSwitchChange = (key) => (e) => {
    setOptions((prev) => ({
      ...prev,
      [key]: e.target.checked,
    }));
  };

  // estilos compactos para cada label
  const labelStyle = {
    fontSize: 8,
    marginBottom: 4, // separación más pequeña
    display: "flex",
    flexDirection: "column",
    gap: 2, // espacio entre texto y slider/switch
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
        Error Máximo en Pantalla: {options.maximumScreenSpaceError}
        <CalciteSlider
          min={1}
          max={64}
          step={1}
          value={options.maximumScreenSpaceError}
          labelHandles
          onCalciteSliderInput={handleSliderChange("maximumScreenSpaceError")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Escala de Error Geométrico: {options.geometricErrorScale}
        <CalciteSlider
          min={0}
          max={2}
          step={0.1}
          value={options.geometricErrorScale}
          labelHandles
          onCalciteSliderInput={handleSliderChange("geometricErrorScale")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Atenuación Máxima: {options.maximumAttenuation}
        <CalciteSlider
          min={0}
          max={10}
          step={0.5}
          value={options.maximumAttenuation}
          labelHandles
          onCalciteSliderInput={handleSliderChange("maximumAttenuation")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Resolución Base: {options.baseResolution}
        <CalciteSlider
          min={0}
          max={1}
          step={0.01}
          value={options.baseResolution}
          labelHandles
          onCalciteSliderInput={handleSliderChange("baseResolution")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Intensidad EDL: {options.eyeDomeLightingStrength}
        <CalciteSlider
          min={0}
          max={5}
          step={0.1}
          value={options.eyeDomeLightingStrength}
          labelHandles
          onCalciteSliderInput={handleSliderChange("eyeDomeLightingStrength")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Radio EDL: {options.eyeDomeLightingRadius}
        <CalciteSlider
          min={0}
          max={5}
          step={0.1}
          value={options.eyeDomeLightingRadius}
          labelHandles
          onCalciteSliderInput={handleSliderChange("eyeDomeLightingRadius")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Atenuación
        <CalciteSwitch
          checked={options.attenuation}
          onCalciteSwitchChange={handleSwitchChange("attenuation")}
        />
      </CalciteLabel>

      <CalciteLabel style={labelStyle}>
        Iluminación Eye Dome
        <CalciteSwitch
          checked={options.eyeDomeLighting}
          onCalciteSwitchChange={handleSwitchChange("eyeDomeLighting")}
        />
      </CalciteLabel>
    </div>
  );
}

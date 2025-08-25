import React, { useEffect, useRef } from "react";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

defineCustomElements(window);

export default function PointCloudControls({ options = {}, setOptions }) {
  const sliderRefs = useRef({});
  const checkboxRefs = useRef({});

  useEffect(() => {
    Object.keys(sliderRefs.current).forEach((key) => {
      const slider = sliderRefs.current[key];
      slider?.addEventListener("calciteSliderInput", (e) => {
        const value = parseFloat(e.target.value);
        setOptions((prev) => ({
          ...prev,
          [key]: value === 0 ? undefined : value,
        }));
      });
    });

    Object.keys(checkboxRefs.current).forEach((key) => {
      const checkbox = checkboxRefs.current[key];
      checkbox?.addEventListener("calciteCheckboxChange", (e) => {
        setOptions((prev) => ({
          ...prev,
          [key]: e.target.checked,
        }));
      });
    });

    // Cleanup
    return () => {
      Object.keys(sliderRefs.current).forEach((key) => {
        const slider = sliderRefs.current[key];
        slider?.removeEventListener("calciteSliderInput", () => {});
      });
      Object.keys(checkboxRefs.current).forEach((key) => {
        const checkbox = checkboxRefs.current[key];
        checkbox?.removeEventListener("calciteCheckboxChange", () => {});
      });
    };
  }, [setOptions]);

  if (!options || Object.keys(options).length === 0) {
    return (
      <div style={{ padding: 16, color: "#aaa" }}>
        ⚠ No hay opciones de nube de puntos disponibles
      </div>
    );
  }

  const sliders = [
    { key: "maximumScreenSpaceError", label: "Máx Error de Pantalla", min: 1, max: 64, step: 1, default: 16 },
    { key: "geometricErrorScale", label: "Escala de Error Geométrico", min: 0, max: 2, step: 0.1, default: 1 },
    { key: "maximumAttenuation", label: "Máx Atenuación", min: 0, max: 10, step: 0.5, default: 0 },
    { key: "baseResolution", label: "Resolución Base", min: 0, max: 1, step: 0.01, default: 0 },
    { key: "eyeDomeLightingStrength", label: "Fuerza EDL", min: 0, max: 5, step: 0.1, default: 1 },
    { key: "eyeDomeLightingRadius", label: "Radio EDL", min: 0, max: 5, step: 0.1, default: 1 },
  ];

  const checkboxes = [
    { key: "attenuation", label: "Atenuación" },
    { key: "eyeDomeLighting", label: "Iluminación Eye Dome" },
  ];

  return (
    <div
      style={{
        background: "rgba(40, 40, 50, 0.85)",
        color: "#fff",
        padding: 16,
        borderRadius: 10,
        width: 280,
        fontSize: 14,
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      <h4 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>
        Configuración de Nube de Puntos
      </h4>

      {sliders.map(({ key, label, min, max, step, default: def }) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <label>{label}: {options[key] ?? def}</label>
          <calcite-slider
            ref={(el) => (sliderRefs.current[key] = el)}
            min={min}
            max={max}
            step={step}
            value={options[key] ?? def}
            snap
            style={{ width: "100%" }}
          ></calcite-slider>
        </div>
      ))}

      {checkboxes.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: 6 }}>
          <calcite-checkbox
            ref={(el) => (checkboxRefs.current[key] = el)}
            checked={options[key] ?? false}
          >
            {label}
          </calcite-checkbox>
        </div>
      ))}
    </div>
  );
}

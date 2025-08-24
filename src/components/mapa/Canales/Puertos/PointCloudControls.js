import React from "react";
import PropTypes from "prop-types";

export default function PointCloudControls({ options = {}, setOptions }) {
  const handleChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : parseFloat(e.target.value);

    setOptions((prev) => ({
      ...prev,
      [key]: value === 0 ? undefined : value,
    }));
  };

  // si todavía no hay opciones, evitamos renderizar sliders vacíos
  if (!options || Object.keys(options).length === 0) {
    return (
      <div style={{ padding: 16, color: "#aaa" }}>
        ⚠ No hay opciones de nube de puntos disponibles
      </div>
    );
  }

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

      <div style={{ marginBottom: 10 }}>
        <label>
          Máx Error de Pantalla: {options.maximumScreenSpaceError ?? 16}
        </label>
        <input
          type="range"
          min="1"
          max="64"
          step="1"
          value={options.maximumScreenSpaceError ?? 16}
          onChange={handleChange("maximumScreenSpaceError")}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Escala de Error Geométrico: {options.geometricErrorScale ?? 1}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={options.geometricErrorScale ?? 1}
          onChange={handleChange("geometricErrorScale")}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Máx Atenuación: {options.maximumAttenuation ?? 0}</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={options.maximumAttenuation ?? 0}
          onChange={handleChange("maximumAttenuation")}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Resolución Base: {options.baseResolution ?? 0}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={options.baseResolution ?? 0}
          onChange={handleChange("baseResolution")}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Fuerza EDL: {options.eyeDomeLightingStrength ?? 1}</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={options.eyeDomeLightingStrength ?? 1}
          onChange={handleChange("eyeDomeLightingStrength")}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Radio EDL: {options.eyeDomeLightingRadius ?? 1}</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={options.eyeDomeLightingRadius ?? 1}
          onChange={handleChange("eyeDomeLightingRadius")}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 6 }}>
        <label>
          <input
            type="checkbox"
            checked={options.attenuation ?? false}
            onChange={handleChange("attenuation")}
          />
          &nbsp;Atenuación
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={options.eyeDomeLighting ?? false}
            onChange={handleChange("eyeDomeLighting")}
          />
          &nbsp;Iluminación Eye Dome
        </label>
      </div>
    </div>
  );
}



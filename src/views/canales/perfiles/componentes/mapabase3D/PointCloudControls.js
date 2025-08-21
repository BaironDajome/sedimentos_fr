import React from "react";
import PropTypes from "prop-types";

export default function PointCloudControls({ options, setOptions }) {
  const handleChange = (key) => (e) => {
    const value = e.target.type === "checkbox"
      ? e.target.checked
      : parseFloat(e.target.value);
    setOptions((prev) => ({ ...prev, [key]: value === 0 ? undefined : value }));
  };

  return (
    <div style={{
      background: "rgba(30,30,30,0.7)",
      color: "white",
      padding: 12,
      borderRadius: 8,
      width: 250,
      fontSize: 14,
    }}>
      <h4 style={{ marginTop: 0 }}>Point Cloud Shading</h4>
      <label>Max Screen Error: {options.maximumScreenSpaceError}</label>
      <input type="range" min="1" max="64" step="1" value={options.maximumScreenSpaceError}
        onChange={handleChange("maximumScreenSpaceError")} />
      <br />
      <label>Geom Error Scale: {options.geometricErrorScale}</label>
      <input type="range" min="0" max="2" step="0.1" value={options.geometricErrorScale}
        onChange={handleChange("geometricErrorScale")} />
      <br />
      <label>Max Attenuation: {options.maximumAttenuation ?? 0}</label>
      <input type="range" min="0" max="10" step="0.5" value={options.maximumAttenuation ?? 0}
        onChange={handleChange("maximumAttenuation")} />
      <br />
      <label>Base Resolution: {options.baseResolution ?? 0}</label>
      <input type="range" min="0" max="1" step="0.01" value={options.baseResolution ?? 0}
        onChange={handleChange("baseResolution")} />
      <br />
      <label>EDL Strength: {options.eyeDomeLightingStrength}</label>
      <input type="range" min="0" max="5" step="0.1" value={options.eyeDomeLightingStrength}
        onChange={handleChange("eyeDomeLightingStrength")} />
      <br />
      <label>EDL Radius: {options.eyeDomeLightingRadius}</label>
      <input type="range" min="0" max="5" step="0.1" value={options.eyeDomeLightingRadius}
        onChange={handleChange("eyeDomeLightingRadius")} />
      <br />
      <label>
        <input type="checkbox" checked={options.attenuation}
          onChange={handleChange("attenuation")} />
        &nbsp;Attenuation
      </label>
      <br />
      <label>
        <input type="checkbox" checked={options.eyeDomeLighting}
          onChange={handleChange("eyeDomeLighting")} />
        &nbsp;Eye Dome Lighting
      </label>
    </div>
  );
}

PointCloudControls.propTypes = {
  options: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
};

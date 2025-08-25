// components/ExaggerationControls.jsx
import React, { useEffect, useRef } from "react";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

defineCustomElements(window);

const ControlExageracion = ({ exaggeration, relHeight, onExaggerationChange, onRelHeightChange }) => {
  const exaggerationRef = useRef(null);
  const relHeightRef = useRef(null);

  // Vincula eventos una vez que los sliders estén montados
  useEffect(() => {
    const exaggerationSlider = exaggerationRef.current;
    const relHeightSlider = relHeightRef.current;

    if (exaggerationSlider) {
      exaggerationSlider.addEventListener("calciteSliderInput", (e) => {
        onExaggerationChange(e.target.value);
      });
    }

    if (relHeightSlider) {
      relHeightSlider.addEventListener("calciteSliderInput", (e) => {
        onRelHeightChange(e.target.value);
      });
    }

    // Cleanup
    return () => {
      exaggerationSlider?.removeEventListener("calciteSliderInput", (e) => {
        onExaggerationChange(e.target.value);
      });
      relHeightSlider?.removeEventListener("calciteSliderInput", (e) => {
        onRelHeightChange(e.target.value);
      });
    };
  }, [onExaggerationChange, onRelHeightChange]);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(30,30,30,0.7)",
        padding: "8px 12px",
        borderRadius: 6,
        color: "#fff",
        fontSize: 14,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "200px",
      }}
    >
      {/* Exageración Z */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Exageración Z: {exaggeration}</label>
        <calcite-slider
          ref={exaggerationRef}
          min={1}
          max={10}
          step={0.5}
          value={exaggeration}
          snap
          style={{ width: "100%" }}
        ></calcite-slider>
      </div>

      {/* Altura Relativa */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Altura Relativa: {relHeight}</label>
        <calcite-slider
          ref={relHeightRef}
          min={0}
          max={5}
          step={0.5}
          value={relHeight}
          snap
          style={{ width: "100%" }}
        ></calcite-slider>
      </div>
    </div>
  );
};

export default ControlExageracion;

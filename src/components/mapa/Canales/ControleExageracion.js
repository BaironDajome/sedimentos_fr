// components/ExaggerationControls.jsx
import React from "react";
import PropTypes from "prop-types";

const ExaggerationControls = ({ exaggeration, relHeight, onExaggerationChange, onRelHeightChange }) => {
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
      }}
    >
      <div style={{ marginBottom: 6 }}>
        <label>Exageración Z: {exaggeration}</label>
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={exaggeration}
          onChange={(e) => onExaggerationChange(Number(e.target.value))}
          style={{ width: 140 }}
        />
      </div>
      <div>
        <label>Altura Relativa: {relHeight}</label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={relHeight}
          onChange={(e) => onRelHeightChange(Number(e.target.value))}
          style={{ width: 140 }}
        />
      </div>
    </div>
  );
};

ExaggerationControls.propTypes = {
  exaggeration: PropTypes.number.isRequired,
  relHeight: PropTypes.number.isRequired,
  onExaggerationChange: PropTypes.func.isRequired,
  onRelHeightChange: PropTypes.func.isRequired,
};

export default ExaggerationControls;

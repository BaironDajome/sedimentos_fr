// LeyendaBatimetria.jsx
import React from "react";

const LeyendaBatimetria = () => (
  <div
    style={{
      position: "absolute",
      bottom: 20,
      right: 20,
      background: "rgba(0, 0, 0, 0.6)",
      padding: "10px",
      borderRadius: "8px",
      color: "white",
      fontSize: "12px",
      zIndex: 999,
      lineHeight: "1.5",
    }}
  >
    <div><span style={{ color: "#00008B" }}>●</span> Muy profundo</div>
    <div><span style={{ color: "#0000FF" }}>●</span> Profundo</div>
    <div><span style={{ color: "#00BFFF" }}>●</span> Intermedio</div>
    <div><span style={{ color: "#ADFF2F" }}>●</span> Somero</div>
    <div><span style={{ color: "#FFFF00" }}>●</span> Costero</div>
  </div>
);

export default LeyendaBatimetria;

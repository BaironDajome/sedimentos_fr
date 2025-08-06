import React from "react";
import { getColorTemperatura, getColorSalinidad } from "../../Utilitis/Helper";
import "./LegendCard.css"; // opcional para estilos separados

const LegendCard = ({ tipoDato, calor }) => {
  if (!calor || calor.length === 0) return null;

  const colorStops =
    tipoDato === "salinidad" ? getColorSalinidad() : getColorTemperatura();

  const minVal = Math.min(...calor.map(d => d.valorn));
  const maxVal = Math.max(...calor.map(d => d.valorn));
  const label = tipoDato === "salinidad" ? "PSU" : "°C";

  return (
    <div className="legend-card">
      <div className="legend-gradient">
        {colorStops.map((stop, index) => (
          <div
            key={index}
            className="legend-color"
            style={{
              backgroundColor: stop.color,
              width: `${100 / colorStops.length}%`,
            }}
          />
        ))}
      </div>
      <div className="legend-labels">
        <span>{minVal.toFixed(2)} {label}</span>
        <span>{maxVal.toFixed(2)} {label}</span>
      </div>
    </div>
  );
};

export default LegendCard;

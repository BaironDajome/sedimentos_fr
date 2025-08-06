// getCustomColorStops.js

const getCustomColorStops = (min, max) => [
    { value: min, color: "#0000FF" },
    { value: min + (max - min) * 0.10, color: "#0020FF" },
    { value: min + (max - min) * 0.20, color: "#0040FF" },
    { value: min + (max - min) * 0.30, color: "#0060FF" },
    { value: min + (max - min) * 0.40, color: "#0080FF" },
    { value: min + (max - min) * 0.50, color: "#00A0FF" },
    { value: min + (max - min) * 0.60, color: "#00C0FF" },
    { value: min + (max - min) * 0.70, color: "#00E0FF" },
    { value: min + (max - min) * 0.80, color: "#00FFFF" },
    { value: min + (max - min) * 0.85, color: "#7FFF00" },
    { value: min + (max - min) * 0.90, color: "#FFFF00" },
    { value: min + (max - min) * 0.95, color: "#FFBF00" },
    { value: max, color: "#FF0000" }
  ];
  
  export default getCustomColorStops;
  
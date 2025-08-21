import React, { useEffect, useRef, useState } from "react";
import { usePuertosStore } from "../../../hook";
import TarjetaPuertos from "./Puertos/TarjetaPuertos";
import LocalizacionCesium from "../Localizacion/LocalizacionCesium";
import MapaBase3D from "./Mapacesium";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
import "./Mapa.css";

// Inicializar Calcite una sola vez
defineCustomElements(window);

export const Mapa = () => {
  const { cargarAllPuertos, definirPuerto } = usePuertosStore();
  const [panelActivo, setPanelActivo] = useState(null);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState(null);
  const [puertos, setPuertos] = useState([]);
  const [view, setView] = useState(null);

  // Estado para PointCloudControls
  const [pcOptions, setPcOptions] = useState({
    maximumScreenSpaceError: 8,
    geometricErrorScale: 1,
    maximumAttenuation: 2,
    baseResolution: 0.1,
    eyeDomeLightingStrength: 1,
    eyeDomeLightingRadius: 1,
    attenuation: false,
    eyeDomeLighting: false,
  });

  // Estado para ControlExageracion
  const [terrainOptions, setTerrainOptions] = useState({
    exaggeration: 1,
    relHeight: 0,
  });

  const basemapRef = useRef(null);
  const basemapToolsRef = useRef(null);

  // Cargar puertos
  useEffect(() => {
    const cargarDatos = async () => {
      const puertosDB = await cargarAllPuertos();
      setPuertos(puertosDB);
    };
    cargarDatos();
  }, []);

  const handlePuertoChange = (value) => {
    if (value === "all") {
      definirPuerto("all");
      setPuertoSeleccionado("all");
    } else {
      const puertoEncontrado = puertos.find((p) => p.name === value);
      if (puertoEncontrado) {
        definirPuerto(puertoEncontrado);
        setPuertoSeleccionado(puertoEncontrado.name);
      }
    }
  };

  // 👉 Callback para recibir cambios de ControlExageracion
  const handleExaggerationChange = ({ exaggeration, relHeight }) => {
    setTerrainOptions({ exaggeration, relHeight });
    // Aquí puedes propagar los valores al MapaBase3D si lo necesitas
    // e.g., view.map.ground.exaggeration = exaggeration;
  };

  // 👉 Callback para recibir cambios de PointCloudControls
  const handlePcOptionsChange = (newOptions) => {
    setPcOptions(newOptions);
  };

  return (
    <div style={{ height: "81vh", width: "100%", position: "relative" }}>
      <div style={{ height: "100%", width: "100%" }}>
        <MapaBase3D
          setView={setView}
          basemapRef={basemapRef}
          pcOptions={pcOptions} // 👈 shading llega a Cesium
          terrainOptions={terrainOptions} // 👈 exageración y altura
        />
        {view && <LocalizacionCesium view={view} localizar={puertoSeleccionado} />}
      </div>

      {/* Sidebar derecho */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          zIndex: 999,
        }}
      >
        <calcite-action-bar style={{ borderRadius: "4px 0 0 4px", height: "100%" }}>
          <calcite-action
            icon="classify-pixels"
            text="Capas"
            active={panelActivo === "modelos"}
            onClick={() =>
              setPanelActivo((prev) => (prev === "modelos" ? null : "modelos"))
            }
          />
          <calcite-action
            icon="information"
            text="Información"
            active={panelActivo === "info"}
            onClick={() =>
              setPanelActivo((prev) => (prev === "info" ? null : "info"))
            }
          />
        </calcite-action-bar>

        {panelActivo === "modelos" && (
          <div className="panelWrapper">
            <TarjetaPuertos
              view={view}
              puertos={puertos}
              onPuertoChange={handlePuertoChange}
              basemapRef={basemapRef}
              basemapToolsRef={basemapToolsRef}
              setPcOptions={handlePcOptionsChange} // 👈 actualizar shading
              handleExaggerationChange={handleExaggerationChange} // 👈 actualizar exageración
            />
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { usePuertosStore } from "../../../hook";
import TarjetaPuertos from "./Puertos/TarjetaPuertos";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
import "./Mapa.css";
import LocalizacionCesium from "../Localizacion/LocalizacionCesium";
import MapaCesium from "../../../views/canales/perfiles/componentes/mapabase3D/Mapacesium";

// Inicializar Calcite una sola vez
defineCustomElements(window);

export const Mapa = () => {
  const { cargarAllPuertos, definirPuerto } = usePuertosStore();
  const [panelActivo, setPanelActivo] = useState(null);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState(null);
  const [puertos, setPuertos] = useState([]);

  // Cargar puertos al montar
  useEffect(() => {
    const cargarDatos = async () => {
      const puertosDB = await cargarAllPuertos();
      setPuertos(puertosDB);
    };
    cargarDatos();
  }, []);

  // Manejo de selección de puerto
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

  // Callback para cambios de Exageración/Altura
  const handleExaggerationChangeInternal = (newOptions) => {
    console.log("Opciones de Exageración:", newOptions);
    setTerrainOptions(newOptions);
  };

  // Callback para cambios de PointCloud
  const handlePcOptionsChangeInternal = (newOptions) => {
    console.log("Opciones de PointCloud:", newOptions);
    setPcOptions(newOptions);
  };

  return (
    <div style={{ height: "81vh", width: "100%", position: "relative" }}>
      {/* Mapa 3D Cesium */}
          <MapaCesium>
            <LocalizacionCesium localizar={puertoSeleccionado}/>
          </MapaCesium>
      {/* Sidebar derecho */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "20%",
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
            onClick={() => setPanelActivo(prev => prev === "modelos" ? null : "modelos")}
          />
          <calcite-action
            icon="information"
            text="Información"
            active={panelActivo === "info"}
            onClick={() => setPanelActivo(prev => prev === "info" ? null : "info")}
          />
        </calcite-action-bar>

        {panelActivo === "modelos" && (
          <div className="panelWrapper">
            <TarjetaPuertos
              puertos={puertos}
              onPuertoChange={handlePuertoChange}
              setPcOptions={handlePcOptionsChangeInternal}
              handleExaggerationChange={handleExaggerationChangeInternal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

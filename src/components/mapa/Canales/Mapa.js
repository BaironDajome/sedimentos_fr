import React, { useEffect, useState } from "react";
import { usePuertosStore } from "../../../hook";
import TarjetaPuertos from "./Puertos/TarjetaPuertos";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
import "./Mapa.css";
import LocalizacionCesium from "./Puertos/LocalizacionCesium";
import MapaCesium from "../../../views/canales/perfiles/componentes/mapabase3D/Mapacesium";
import PointCloudControls from "./Puertos/PointCloudControls";
import ControlExageracion from "./Puertos/ControlExageracion";
import LoadTileset from "./Puertos/LoadTileset";
import Boyas3D from "./Puertos/Boyas3D";
import Navegar from "./Puertos/Navegar"; // 👈 importar el componente

// Inicializar Calcite una sola vez
defineCustomElements(window);

export const Mapa = () => {
  const { cargarAllPuertos, definirPuerto } = usePuertosStore();
  const [panelActivo, setPanelActivo] = useState(null);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState(null);
  const [puertos, setPuertos] = useState([]);
  const [glbUrl, setGlbUrl] = useState("/boyas/barco5.glb");
  // Estados para toggles
  const [mostrarBoyas, setMostrarBoyas] = useState(false);
  const [mostrarSedimento, setMostrarSedimento] = useState(false);
  const [mostrarNavegar, setMostrarNavegar] = useState(false); // 👈 NUEVO

  // Estados para las URLs dinámicas
  const [tilesetUrl, setTilesetUrl] = useState(null);
  const [boyasUrl, setBoyasUrl] = useState(null);

  // Estados de exageración y pointCloud
  const [exaggeration, setExaggeration] = useState(1);
  const [relHeight, setRelHeight] = useState(0);
  const [pointCloudOptions, setPointCloudOptions] = useState({
    maximumScreenSpaceError: 16.0,
    geometricErrorScale: 1.0,
    maximumAttenuation: undefined,
    baseResolution: undefined,
    eyeDomeLightingStrength: 1.0,
    eyeDomeLightingRadius: 1.0,
    attenuation: true,
    eyeDomeLighting: true,
  });

  const [viewer, setViewer] = useState(null);

  // Cargar puertos al montar
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

  // 🟢 Tileset dinámico
  useEffect(() => {
    if (!mostrarSedimento) {
      setTilesetUrl(null);
      return;
    }
    if (puertoSeleccionado === "Tumaco") {
      setTilesetUrl("/Canales/Tumaco/2025/tileset.json");
    } else if (puertoSeleccionado === "Buenaventura") {
      setTilesetUrl("/Canales/BuenaVentura/2025/tileset.json");
    } else {
      setTilesetUrl(null);
    }
  }, [mostrarSedimento, puertoSeleccionado]);

  // 🟢 Boyas dinámicas
  useEffect(() => {
    if (!mostrarBoyas) {
      setBoyasUrl(null);
      return;
    }
    if (puertoSeleccionado === "Tumaco") {
      setBoyasUrl("/Canales/Tumaco/boyas/boyas.json");
    } else if (puertoSeleccionado === "Buenaventura") {
      setBoyasUrl("/Canales/BuenaVentura/boyas/boyas.json");
    } else {
      setBoyasUrl(null);
    }
  }, [mostrarBoyas, puertoSeleccionado]);

  return (
    <div style={{ height: "81vh", width: "100%", position: "relative" }}>
      {/* Mapa 3D Cesium */}
      <MapaCesium
        exaggeration={exaggeration}
        relHeight={relHeight}
        pointCloudOptions={pointCloudOptions}
        onViewerReady={setViewer}
      >
        <LocalizacionCesium localizar={puertoSeleccionado} />

        {/* Boyas */}
        {boyasUrl && <Boyas3D url={boyasUrl} />}

        {/* Tileset */}
        {tilesetUrl && (
          <LoadTileset
            viewer={viewer}
            url={tilesetUrl}
            pointCloudOptions={pointCloudOptions}
          />
        )}

        {/* Navegar */}
        {mostrarNavegar && <Navegar viewer={viewer} glbUrl={glbUrl} boyasUrl={boyasUrl}/>}
      </MapaCesium>

      {/* Controles de exageración y PointCloud */}
      {viewer && (
        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 35,
            display: "flex",
            flexDirection: "column",
            gap: 140,
            zIndex: 999,
          }}
        >
          <div style={{ maxWidth: 330 }}>
            <ControlExageracion
              exaggeration={exaggeration}
              relHeight={relHeight}
              onExaggerationChange={setExaggeration}
              onRelHeightChange={setRelHeight}
            />
          </div>

          <div style={{ maxWidth: 300 }}>
            <PointCloudControls
              options={pointCloudOptions}
              setOptions={setPointCloudOptions}
            />
          </div>
        </div>
      )}

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
        <calcite-action-bar
          style={{ borderRadius: "4px 0 0 4px", height: "100%" }}
        >
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
              puertos={puertos}
              onPuertoChange={handlePuertoChange}
              mostrarBoyas={mostrarBoyas}
              onToggleBoyas={setMostrarBoyas}
              mostrarSedimento={mostrarSedimento}
              onToggleSedimento={setMostrarSedimento}
              mostrarNavegar={mostrarNavegar}               // 👈 nuevo
              onToggleNavegar={setMostrarNavegar}           // 👈 nuevo
            />
          </div>
        )}
      </div>
    </div>
  );
};

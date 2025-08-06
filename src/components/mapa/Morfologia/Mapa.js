import React, {useEffect, useRef, useState } from "react";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import { usePuertosStore,useMorfologiaStore } from "../../../hook";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
import "@esri/calcite-components/dist/calcite/calcite.css";
import Localizacion from "../Localizacion/Localizacion";
import TarjetaCorriente from "./TarjetaMorfologia/TarjetaCorriente";
import "./Mapa.css";
import MapaBase3D from "../Basemap/MapaBase3D";
import TarjetaCosta from "./TarjetaMorfologia/TarjetaCosta";

defineCustomElements(window);

export const Mapa = () => {
  const { cargarAllPuertos, definirPuerto} = usePuertosStore();
  const { cargarAllLineasCosta } = useMorfologiaStore();
  
  const [panelActivo, setPanelActivo] = useState(null);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState(null);
  const [puertos, setPuertos] = useState([]);
  const [linea, setLinea] = useState([]);
  const [view, setView] = useState(null);
 
  const basemapDivRef = useRef(null);
  const basemapWidget = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const puertosDB = await cargarAllPuertos();
      const lineaC = await cargarAllLineasCosta();
      // console.log(lineaC);
      setPuertos(puertosDB);
      setLinea(lineaC);

    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!view || !panelActivo || !basemapDivRef.current) return;

    basemapWidget.current?.destroy();
    basemapWidget.current = new BasemapGallery({
      view,
      container: basemapDivRef.current,
    });

    return () => basemapWidget.current?.destroy();
  }, [view, panelActivo]);

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

  return (
    <div style={{ height: "81vh", width: "100%", position: "relative" }}>
      <div style={{ height: "100%", width: "100%" }}>
        <MapaBase3D setView={setView} />
        {view && <Localizacion view={view} localizar={puertoSeleccionado} />}
  
      </div>

      <div className="actionPanelContainer">
        <calcite-action-bar style={{ borderRadius: "4px 0 0 4px" }}>
          <calcite-action
            icon="classify-pixels"
            text="Capas"
            active={panelActivo === "corrientes"}
            onClick={() =>
              setPanelActivo((prev) => (prev === "corrientes" ? null : "corrientes"))
            }
          />
          <calcite-action
            icon="clear-selection"
            text="Modelos"
            active={panelActivo === "costa"}
            onClick={() =>
              setPanelActivo((prev) => (prev === "costa" ? null : "costa"))
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

          {panelActivo === "corrientes" && (
            <div className="panelWrapper">
              <TarjetaCorriente
                view={view}
                puertos={puertos}
                onPuertoChange={handlePuertoChange}
                basemapRef={basemapDivRef}
              />
            </div>
          )}

          {panelActivo === "costa" && (
            <div className="panelWrapper">
              <TarjetaCosta
                view={view}
                puertos={puertos}
                linea={linea}
                onPuertoChange={handlePuertoChange}
                basemapRef={basemapDivRef}
              />
            </div>
          )}

      </div>

      </div>
  
  );
};

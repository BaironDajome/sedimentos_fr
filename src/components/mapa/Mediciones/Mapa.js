import React, { useEffect, useRef, useState } from "react";
import MapaBase from "../Basemap/MapaBase";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Localizacion from "../Localizacion/Localizacion";
import { GraphicsEstacionesWidget } from "./Layers_mediciones/GraphicsEstacionesWidget";
import { usePuertosStore, useEstacionesStore, useCampaniaStore } from "../../../hook";

import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

import TarjetaControl from "./VisualizacionEstaciones/TarjetaEstaciones/TarjetaControl";
import TarjetaAnalisis from "./VisualizacionEstaciones/TarjetaAnalisis/TarjetaAnalisis";

import "./Mapa.css";

defineCustomElements(window);

export const Mapa = () => {
  const { cargarAllPuertos, definirPuerto} = usePuertosStore();
  const { cargarAllEstaciones, cargarDatosEstacionesC } = useEstacionesStore();
  const { cargarAllCampanias } = useCampaniaStore();

  const [view, setView] = useState(null);
  const [puertos, setPuertos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [allEstacionesd, setAllEstacionesd] = useState([]);
  const [campanias, setCampanias] = useState([]);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState(null);
  const [panelActivo, setPanelActivo] = useState(null);

  const basemapDivRef = useRef(null);
  const basemapWidget = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const puertosDB = await cargarAllPuertos();
      const estacionesDB = await cargarAllEstaciones();
      const campaniasDB = await cargarAllCampanias();
      const datosAll = await cargarDatosEstacionesC();

      setPuertos(puertosDB);
      setEstaciones(estacionesDB);
      setCampanias(campaniasDB);
      setAllEstacionesd(datosAll);
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
        <MapaBase setView={setView} />
        {view && <Localizacion view={view} localizar={puertoSeleccionado} />}
        {view && panelActivo !== "modelos" && (
          <GraphicsEstacionesWidget view={view} estaciones={estaciones} />
        )}
      </div>

      <div className="actionPanelContainer">
        <calcite-action-bar style={{ borderRadius: "4px 0 0 4px" }}>
          <calcite-action
            icon="layers"
            text="Capas"
            active={panelActivo === "capas"}
            onClick={() =>
              setPanelActivo((prev) => (prev === "capas" ? null : "capas"))
            }
          />
          <calcite-action
            icon="wrench"
            text="Modelos"
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

        {panelActivo === "capas" && (
          <div className="panelWrapper">
            <TarjetaControl
              puertos={puertos}
              estaciones={estaciones}
              onPuertoChange={handlePuertoChange}
              basemapRef={basemapDivRef}
              view={view}
            />
          </div>
        )}

        {panelActivo === "modelos" && (
          <div className="panelWrapper">
            <TarjetaAnalisis
              view={view}
              puertos={puertos}
              allestacionesd={allEstacionesd}
              campanias={campanias}
              onPuertoChange={handlePuertoChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

import { useEffect, useState, useRef } from "react";

// Calcite Components
import "@esri/calcite-components/dist/components/calcite-accordion";
import "@esri/calcite-components/dist/components/calcite-accordion-item";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-combobox";
import "@esri/calcite-components/dist/components/calcite-combobox-item";
import "@arcgis/map-components/dist/components/arcgis-time-slider.js";

import {
  CalciteAccordion,
  CalciteAccordionItem,
  CalciteList,
} from "@esri/calcite-components-react";

// Hooks personalizados
import { useMorfologiaStore, usePuertosStore } from "../../../../hook";

// Estilos y utilidades
import "./Tarjeta_Informacion.css";
import { lienasdeCosta } from "../../Mediciones/Utilitis/Helper";

// Componentes para pintar capas
// import PintarLineaCosta from "../PintaLineas/LineasCostaPainter";
// import PintarGeoJSON from "../PintaLineas/LineasCostaGeojson";
// import PintarGeoJSON3D from "../PintaLineas/FlechasCorriente3D";
// import PintarPuntoGeoJSON3D from "../PintaLineas/Punto3D";
 import FlechasOleaje3D from "../PintaLinea/FlechasOleaje3D";
// import FlechasOleaje3Dhsig from "../PintaLinea/FlechasOleaje3Dhsig";

export default function Tarjeta_Informacion_Oleaje({ view }) {
  const { lineacosta } = useMorfologiaStore();
  const { puerto } = usePuertosStore();

  const [selectedLine, setSelectedLine] = useState(null);
  const timeSliderRef = useRef(null);

  // Asociar vista al time slider
  useEffect(() => {
    if (timeSliderRef.current && view) {
      timeSliderRef.current.view = view;
    }
  }, [view]);

  // Calcular líneas relevantes según puerto
  useEffect(() => {
    if (!lineacosta || lineacosta.length === 0) return;
    const linea = lienasdeCosta({ lineacosta, puerto });
    setSelectedLine(linea);
  }, [lineacosta, puerto]);

  return (
    <>
      <CalciteAccordion selectionMode="single">
        <CalciteAccordionItem
          description="Corrientes de Costa"
          itemTitle="Resumen por descripción"
          iconStart="list"
          open={true}
        >
          <CalciteList>

          </CalciteList>
        </CalciteAccordionItem>
      </CalciteAccordion>

      {/* <FlechasOleaje3Dhsig view={view}/> */}
            <FlechasOleaje3D view={view}/>

    </>
  );
}


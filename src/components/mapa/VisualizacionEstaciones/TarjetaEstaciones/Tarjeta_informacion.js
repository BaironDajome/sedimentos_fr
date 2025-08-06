import { useEffect, useState } from "react";
import "@esri/calcite-components/dist/components/calcite-accordion";
import "@esri/calcite-components/dist/components/calcite-accordion-item";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-combobox";
import "@esri/calcite-components/dist/components/calcite-combobox-item";

import {
  CalciteAccordion,
  CalciteAccordionItem,
  CalciteList,
  CalciteListItem,
  CalciteCombobox,
  CalciteComboboxItem,
} from "@esri/calcite-components-react";

import { useEstacionesStore } from "../../../../../hook";
import { getColorByPrefix } from "../../Utilitis/Helper";
import "./Tarjeta_Informacion.css";


export default function Tarjeta_Iformacion({view}) {
  const{marcadores}=useEstacionesStore();
  const [selectedEstacion, setSelectedEstacion] = useState("");
  
  // console.log(marcadores);

  // Ejecuta lógica cada vez que se selecciona una estación
useEffect(() => {
  if (!view || !selectedEstacion || !selectedEstacion.includes(",")) {
    return;
  }

  const [lon, lat] = selectedEstacion.split(",").map(Number);
  const punto = { lat, lon };

   view.when(() => {
    view.goTo(
      {
        center: [lon, lat],
        zoom: 18,
      },
      { duration: 1000 }
    ).catch((err) => {
      console.error("Error al centrar la vista:", err);
    });
  });
}, [selectedEstacion, view]);

  return (
    <CalciteAccordion selectionMode="single">
      <CalciteAccordionItem
        description="Descripción de Estaciones"
        itemTitle="Resumen por descripción"
        iconStart="list"
        open={true}
      >
        <CalciteList>
          {marcadores.map((item, index) => {
            const [r, g, b] = getColorByPrefix(item.iniciales);
            const backgroundColor = `rgb(${r}, ${g}, ${b})`;

            return (
              <div key={index} className="tarjeta-info-item">
                <span
                  className="tarjeta-info-circle"
                  style={{ "--color": backgroundColor }}
                >
                  {item.iniciales}
                </span>

                <CalciteListItem
                  label={item.descripcion}
                  description={`Puntos de Evaluación: ${item.count}`}
                />

                <CalciteCombobox
                  selectionMode="single"
                  placeholder="Estación"
                  onCalciteComboboxChange={(e) => {
                    const selectedValue = e.target.value;                    
                    setSelectedEstacion(selectedValue);
                  }}
                >
                  {item.estaciones.map((estacion, i) => (
                    <CalciteComboboxItem
                      key={i}
                      value={estacion.localizacion.coordinates}
                      textLabel={estacion.nombre}
                    />
                  ))}
                </CalciteCombobox>
              </div>
            );
          })}
        </CalciteList>
      </CalciteAccordionItem>
    </CalciteAccordion>
  );
}

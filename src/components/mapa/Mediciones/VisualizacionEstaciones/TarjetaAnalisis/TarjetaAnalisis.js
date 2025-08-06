import React, { useEffect, useRef, useState } from "react";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { prepararCampanas, prepararMCAlor } from "../../Utilitis/Helper";
import HeatmapComponent from "./HeatmapComponent";
import { KriginHeatComponent } from "./KriginHeatComponent";

export default function TarjetaAnalisis({ view, puertos = [], campanias, allestacionesd, onPuertoChange }) {
  const [puertoSeleccionado, setPuertoSeleccionado] = useState(null);
  const [campaniasdef, setCampaniasdef] = useState(null);
  const [campaniaSeleccionada, setCampaniaSeleccionada] = useState(null);
  const [profundidad, setProfundidad] = useState(0.5);
  const [tipoDato, setTipoDato] = useState("temperatura");
  const [datoCalor, setDatoCalor] = useState([]);
  const [mostrarInterpolacion, setMostrarInterpolacion] = useState(false);

  const switchesRef = useRef({});
  const campaniaSwitchesRef = useRef({});
  const sliderRef = useRef(null);
  const checkboxRefs = useRef({});

  useEffect(() => {
    setCampaniasdef(puertoSeleccionado ? prepararCampanas(puertoSeleccionado, campanias) : null);
    setCampaniaSeleccionada(null);
  }, [puertoSeleccionado, campanias]);

  useEffect(() => {
    if (puertoSeleccionado && campaniaSeleccionada) {
      const { valores } = prepararMCAlor(puertoSeleccionado, campaniaSeleccionada, profundidad, allestacionesd, tipoDato);
      setDatoCalor(valores);
    }
  }, [puertoSeleccionado, campaniaSeleccionada, profundidad, tipoDato]);

  useEffect(() => {
    puertos.forEach(p => switchesRef.current[p.name] && (switchesRef.current[p.name].checked = false));
    setPuertoSeleccionado(null);
  }, [puertos]);

  useEffect(() => {
    campaniasdef?.forEach(c => campaniaSwitchesRef.current[c.nombre] && (campaniaSwitchesRef.current[c.nombre].checked = false));
    setCampaniaSeleccionada(null);
  }, [campaniasdef]);

  useEffect(() => {
    puertos.forEach(puerto => {
      const sw = switchesRef.current[puerto.name];
      if (!sw) return;
      const listener = (e) => {
        const isChecked = e.target.checked;
        puertos.forEach(p => p.name !== puerto.name && switchesRef.current[p.name] && (switchesRef.current[p.name].checked = false));
        setPuertoSeleccionado(isChecked ? puerto.name : null);
        onPuertoChange?.(isChecked ? puerto.name : null);
      };
      sw.addEventListener("calciteSwitchChange", listener);
      sw._listener = listener;
    });
    return () => puertos.forEach(p => {
      const sw = switchesRef.current[p.name];
      sw?.removeEventListener("calciteSwitchChange", sw._listener);
    });
  }, [puertos, puertoSeleccionado, onPuertoChange]);

  useEffect(() => {
    if (!campaniasdef) return;
    campaniasdef.forEach(camp => {
      const sw = campaniaSwitchesRef.current[camp.nombre];
      if (!sw) return;
      const listener = (e) => {
        const isChecked = e.target.checked;
        campaniasdef.forEach(c => c.nombre !== camp.nombre && campaniaSwitchesRef.current[c.nombre] && (campaniaSwitchesRef.current[c.nombre].checked = false));
        setCampaniaSeleccionada(isChecked ? camp.nombre : null);
      };
      sw.addEventListener("calciteSwitchChange", listener);
      sw._listener = listener;
    });
    return () => campaniasdef.forEach(c => {
      const sw = campaniaSwitchesRef.current[c.nombre];
      sw?.removeEventListener("calciteSwitchChange", sw._listener);
    });
  }, [campaniasdef, campaniaSeleccionada]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleChange = (e) => setProfundidad(parseFloat(e.target.value));
    slider.addEventListener("calciteSliderInput", handleChange);
    return () => slider.removeEventListener("calciteSliderInput", handleChange);
  }, []);

  useEffect(() => {
    const tempCheck = checkboxRefs.current["temperatura"];
    const salCheck = checkboxRefs.current["salinidad"];
    const interpCheck = checkboxRefs.current["interpolacion"];

    const handleChange = (e) => {
      const id = e.target.id;
      const checked = e.target.checked;
      if (id === "checkbox-temperatura" && checked) {
        salCheck.checked = false;
        setTipoDato("temperatura");
      } else if (id === "checkbox-salinidad" && checked) {
        tempCheck.checked = false;
        setTipoDato("salinidad");
      } else if (id === "checkbox-interpolacion") {
        setMostrarInterpolacion(checked);
      }
    };

    tempCheck?.addEventListener("calciteCheckboxChange", handleChange);
    salCheck?.addEventListener("calciteCheckboxChange", handleChange);
    interpCheck?.addEventListener("calciteCheckboxChange", handleChange);

    return () => {
      tempCheck?.removeEventListener("calciteCheckboxChange", handleChange);
      salCheck?.removeEventListener("calciteCheckboxChange", handleChange);
      interpCheck?.removeEventListener("calciteCheckboxChange", handleChange);
    };
  }, []);

  return (
    <calcite-shell-panel slot="panel-end" display-mode="float">
      <calcite-accordion selection-mode="multiple">
        <calcite-accordion-item item-title="🧪 Capas de análisis" description="Mapa de Calor">
          <calcite-panel heading="Configuración para Análisis">
            <div style={{ padding: "1rem" }}>
              <h4>Puerto</h4>
              {puertos.map(p => (
                <calcite-label key={p.name} layout="inline-space-between" style={{ display: "flex", justifyContent: "space-between" }}>
                  {p.name}
                  <calcite-switch ref={el => (switchesRef.current[p.name] = el)} />
                </calcite-label>
              ))}

              {campaniasdef?.length > 0 && (
                <>
                  <h4 style={{ marginTop: "1rem" }}>Campañas</h4>
                  {campaniasdef.map(c => (
                    <calcite-label key={c.nombre} layout="inline-space-between" style={{ display: "flex", justifyContent: "space-between" }}>
                      <span><strong>{c.nombre}</strong>: {c.descripcion} ({c.fecha})</span>
                      <calcite-switch ref={el => (campaniaSwitchesRef.current[c.nombre] = el)} />
                    </calcite-label>
                  ))}
                </>
              )}

              <h4 style={{ marginTop: "1rem" }}>Profundidad</h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span><strong>Profundidad (m)</strong></span>
                <span>{profundidad.toFixed(1)} m</span>
              </div>
              <calcite-slider
                ref={sliderRef}
                min-value="0.5"
                max-value="20"
                min="0.5"
                max="20"
                step="0.5"
                snap
                label-handles
              />

              <h4 style={{ marginTop: "1rem" }}>Tipo de Dato</h4>
              <calcite-label layout="inline">
                <calcite-checkbox
                  id="checkbox-temperatura"
                  checked
                  ref={el => (checkboxRefs.current["temperatura"] = el)}
                />
                Temperatura
              </calcite-label>
              <calcite-label layout="inline" style={{ marginTop: "0.5rem" }}>
                <calcite-checkbox
                  id="checkbox-salinidad"
                  ref={el => (checkboxRefs.current["salinidad"] = el)}
                />
                Salinidad
              </calcite-label>

              <calcite-label layout="inline" style={{ marginTop: "0.5rem" }}>
                <calcite-checkbox
                  id="checkbox-interpolacion"
                  ref={el => (checkboxRefs.current["interpolacion"] = el)}
                />
                Interpolación
              </calcite-label>
            </div>

            <div style={{ padding: "1rem" }}>
              {view && datoCalor.length > 0 && (
                <HeatmapComponent view={view} calor={datoCalor} tipoDato={tipoDato} />
              )}
            </div>
          </calcite-panel>

          {mostrarInterpolacion && (
            <calcite-panel heading="Kriging Heatmap">
              <div style={{ padding: "5rem" }}>
                {view && <KriginHeatComponent view={view} calor={datoCalor} />}
              </div>
            </calcite-panel>
          )}
        </calcite-accordion-item>
      </calcite-accordion>
    </calcite-shell-panel>
  );
}

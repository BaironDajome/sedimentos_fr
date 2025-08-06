import React, { useEffect, useState, useMemo } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import Graphic from "@arcgis/core/Graphic";

import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";

import { createRoot } from "react-dom/client";
import { PopupTabs } from "../Componentes/Popus";
import {
  buildCIMSymbol,
  getColorByPrefix,
  desplazarTarget,
  clearEstaciones
} from "../Utilitis/Helper";
import { usePuertosStore } from "../../../../hook";

import "./estilos.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { useEstacionesStore } from '../../../../hook';

export const GraphicsEstacionesWidget = ({ view, estaciones }) => {
  const { setMarcadores } = useEstacionesStore();

  const { puerto } = usePuertosStore((s) => s.puerto);
  const [data, setData] = useState([]);

  /* ------------------------------------------------------------------ */
  /* 1️⃣ Filtrar y normalizar datos                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (estaciones?.length) {
      // console.log(estaciones);
      // console.log(puerto);
      const { estacionesFiltradas,agrupados } = clearEstaciones({ estaciones, puerto });
      setMarcadores(agrupados);
      setData(estacionesFiltradas);
    } else {
      setData([]);
    }
  }, [estaciones, puerto]);

  /* ------------------------------------------------------------------ */
  /* 2️⃣ Crear features (memo)                                          */
  /* ------------------------------------------------------------------ */
  const features = useMemo(() => {
    if (!data.length) return [];
    return data.map((item) =>
      new Graphic({
        geometry: {
          type: "point",
          longitude: item.localizacion.coordinates[0],
          latitude: item.localizacion.coordinates[1]
        },
        attributes: {
          ...item,
          puerto_id: item.puerto_id,
          simboloColor: getColorByPrefix(item.nombre)
        }
      })
    );
  }, [data]);

  /* ------------------------------------------------------------------ */
  /* 3️⃣ LabelClass con color dinámico usando Arcade                     */
  /* ------------------------------------------------------------------ */
  const labelClass = useMemo(() => new LabelClass({
    labelExpressionInfo: {
      expression: "$feature.nombre"
    },
    labelPlacement: "above-center",
    symbol: {
      type: "text",
      color: "black",
      haloColor: "white",
      haloSize: 1,
      font: {
        size: 10,
        weight: "bold"
      }
    }
  }), []);

  /* ------------------------------------------------------------------ */
  /* 4️⃣ Crear/actualizar capa y eventos                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!view?.ready || !view.map || features.length === 0) return;

    // 👉 Configurar el popup para que se muestre docked arriba a la derecha
    view.popup.dockEnabled = true;
    view.popup.dockOptions = {
      buttonEnabled: true,
      breakpoint: false,
      position: "top-left"
    };

    // Crear renderer
    const renderer = new UniqueValueRenderer({
      field: "nombre",
      defaultSymbol: new SimpleMarkerSymbol({
        color: [0, 112, 255],
        size: 8,
        outline: new SimpleLineSymbol({
          color: [255, 255, 255],
          width: 1
        })
      }),
      uniqueValueInfos: data.map((item) => ({
        value: item.nombre,
        symbol: buildCIMSymbol(getColorByPrefix(item.nombre))
      }))
    });

    // Crear capa de estaciones
    const layer = new FeatureLayer({
      title: "Estaciones",
      id: "estaciones-feature-layer",
      objectIdField: "oid",
      fields: [
        { name: "oid", type: "oid" },
        { name: "id", type: "string" },
        { name: "nombre", type: "string" },
        { name: "puerto_id", type: "string" },
        { name: "simboloColor", type: "string" }
      ],
      source: features,
      labelingInfo: [labelClass],
      popupTemplate: {
        title: "Estación: {nombre}",
        content: (event) => {
          const cont = document.createElement("div");
          const nombre = event.graphic.attributes.id;
          const datos = data.find((e) => e.nombre === nombre);
          createRoot(cont).render(<PopupTabs datos={datos.id} />);
          return cont;
        }
      },
      renderer: renderer
    });

    // Agregar la capa
    view.map.add(layer);
    layer.labelsVisible = true;
    layer.labelingEnabled = true;

    // Evento al abrir el popup
    const openH = view.on("popup::after-open", () => {
      // console.log("Popup abierto");
      const g = view.popup?.selectedFeature;
      if (g?.geometry) {
        view.goTo({ target: desplazarTarget(view, g.geometry), zoom: 12 });
      }
    });

    // Limpieza
    return () => {
      openH.remove();
      if (view?.map) {
        const existing = view.map.findLayerById("estaciones-feature-layer");
        if (existing) view.map.remove(existing);
      }
    };
  }, [view, features, labelClass, data]);

  return null;
};

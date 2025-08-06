import React, { useEffect, useRef } from "react";
import LayerList from "@arcgis/core/widgets/LayerList";
import Expand from "@arcgis/core/widgets/Expand";

// Asegúrate de que este archivo tenga los estilos definidos como en tu ejemplo
import "./estilos.css";

const LayerListWidget = ({ view }) => {
  const layerListRef = useRef(null);

  useEffect(() => {
    if (!view) return;

    // Crear un contenedor personalizado y asignarle una clase
    const container = document.createElement("div");
    container.classList.add("custom-layer-list"); // 👈 Asignamos la clase aquí

    // Inicializar LayerList dentro del contenedor personalizado
    const layerList = new LayerList({
      view,
      container, // Usamos el contenedor con la clase .custom-layer-list
      listItemCreatedFunction: (event) => {
        const item = event.item;
        if (item.layer.type === "base") {
          item.panel = {
            content: "legend",
            open: true
          };
          item.title = `🗺️ ${item.title}`; // Icono para capas base
        } else {
          item.title = `📍 ${item.title}`; // Icono para capas operacionales
        }
      }
    });

    // Widget Expand para mostrarlo como menú desplegable
    const expand = new Expand({
      view,
      content: layerList.domNode,
      expandIconClass: "esri-icon-layers",
      expanded: false,
      expandTooltip: "Capas"
    });

    // Agregar al UI del mapa
    view.ui.add(expand, "top-right");

    layerListRef.current = layerList;

    // Limpieza segura
    return () => {
      if (view.ui.contains(expand)) {
        view.ui.remove(expand);
      }
      layerList.destroy();
    };
  }, [view]);

  return null;
};

export default LayerListWidget;
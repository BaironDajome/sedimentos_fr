import React, { useEffect } from "react";
import Legend from "@arcgis/core/widgets/Legend";

const LegendWidget = ({ view }) => {
  useEffect(() => {
    if (!view) return;

    const checkLayer = () => {
      const layer = view.map.layers.find(layer => layer.title === "Puntos de Datos");
      if (layer) {
        const legendWidget = new Legend({
          view: view,
          layerInfos: [
            {
              layer: layer,
              title: "Puntos de Datos"
            }
          ]
        });

        view.ui.add(legendWidget, "top-right");

        return () => {
          if (legendWidget) {
            legendWidget.destroy();
          }
        };
      } else {
        setTimeout(checkLayer, 100); // Reintentar después de 100ms
      }
    };

    checkLayer();
  }, [view]);

  return null;
};

export default LegendWidget;
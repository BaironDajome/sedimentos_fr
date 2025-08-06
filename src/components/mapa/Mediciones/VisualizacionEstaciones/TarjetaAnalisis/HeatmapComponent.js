import { useEffect } from "react";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { getColorTemperatura, getColorSalinidad } from "../../Utilitis/Helper";
import "./LegendCard.css";

const HeatmapComponent = ({ view, calor, tipoDato }) => {
  useEffect(() => {
    if (!view || !Array.isArray(calor) || calor.length === 0) return;

    const oldHeatmapLayer = view.map.findLayerById("heatmap-layer");
    const oldLabelLayer = view.map.findLayerById("label-layer");
    if (oldHeatmapLayer) view.map.remove(oldHeatmapLayer);
    if (oldLabelLayer) view.map.remove(oldLabelLayer);

    const legendWidgets = view.ui._components?.filter(
      (comp) => comp?.declaredClass === "esri.widgets.Legend"
    );
    legendWidgets?.forEach((legend) => view.ui.remove(legend));

    const colorStops = tipoDato === "salinidad" ? getColorSalinidad() : getColorTemperatura();
    const labelColor = colorStops[colorStops.length - 2].color;

    const graphics = calor.map(({ localizacion, valorn, valor }, index) =>
      new Graphic({
        geometry: {
          type: "point",
          longitude: localizacion[0],
          latitude: localizacion[1],
        },
        attributes: {
          ObjectID: index,
          valorn: Number(valorn),
          valor: Number(valor),
        },
      })
    );

    const heatmapLayer = new FeatureLayer({
      id: "heatmap-layer",
      title: tipoDato === "salinidad" ? "Salinidad" : "Temperatura",
      source: graphics,
      objectIdField: "ObjectID",
      fields: [
        { name: "ObjectID", type: "oid" },
        { name: "valorn", type: "double" },
        { name: "valor", type: "double" },
      ],
      geometryType: "point",
      renderer: {
        type: "heatmap",
        field: "valorn",
        colorStops,
        minPixelIntensity: 0,
        maxPixelIntensity: 1,
        radius: 5,
      },
    });

    const labelLayer = new FeatureLayer({
      id: "label-layer",
      title: "Etiquetas",
      source: graphics,
      objectIdField: "ObjectID",
      fields: [
        { name: "ObjectID", type: "oid" },
        { name: "valorn", type: "double" },
        { name: "valor", type: "double" },
      ],
      geometryType: "point",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          style: "circle", // <-- valor válido
          size: 0,
          color: [0, 0, 0, 0],
          outline: {
            color: [0, 0, 0, 0],
            width: 0,
          },
        },
      },
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression:
              tipoDato === "salinidad"
                ? `Text($feature.valor, "#,###.##") + " PSU"`
                : `Text($feature.valor, "#,###.##") + " °C"`,
          },
          symbol: {
            type: "text",
            color: labelColor,
            haloColor: "white",
            haloSize: "1px",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          labelPlacement: "above-center",
        },
      ],
      labelsVisible: true,
    });

    view.map.addMany([heatmapLayer, labelLayer]);

    return () => {
      if (view?.map) {
        view.map.removeMany([heatmapLayer, labelLayer]);
      }
    };
  }, [view, calor, tipoDato]);

  return null;
};

export default HeatmapComponent;

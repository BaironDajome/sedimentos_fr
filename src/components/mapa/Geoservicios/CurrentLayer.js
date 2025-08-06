import { useEffect } from "react";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
import Extent from "@arcgis/core/geometry/Extent";

const CurrentsLayer = ({ view }) => {
  useEffect(() => {
    if (!view) return;

    // Definir la extensión geográfica de la costa pacífica y atlántica de Colombia
    const colombiaExtent = new Extent({
      xmin: -82, // Pacífico
      ymin: -5,  // Sur
      xmax: -66, // Atlántico
      ymax: 15,  // Norte
      spatialReference: { wkid: 4326 }
    });

    // Crear la capa de corrientes oceánicas con restricciones de visibilidad
    const currentsLayer = new ImageryTileLayer({
      url: "https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Spilhaus_UV_ocean_currents/ImageServer",
      renderer: {
        type: "flow",
        density: 1,
        maxPathLength: 10,
        trailWidth: "2px",
      },
      fullExtent: colombiaExtent, // Limitar la visualización de la capa
    });

    // Agregar la capa al mapa
    view.map.add(currentsLayer);

    // Restringir la vista a la región de Colombia
    view.constraints = {
      geometry: colombiaExtent, // Restringe la navegación
      minZoom: 5,
      maxZoom: 10
    };

    // Establecer la extensión inicial sin posibilidad de salir de ella
    view.extent = colombiaExtent;

    // Limpiar la capa al desmontar el componente
    return () => {
      if (currentsLayer && view.map.findLayerById(currentsLayer.id)) {
        view.map.remove(currentsLayer);
      }
    };
  }, [view]);

  return null;
};

export default CurrentsLayer;

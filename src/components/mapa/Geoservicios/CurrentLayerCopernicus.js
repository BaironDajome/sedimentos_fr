import { useEffect } from "react";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer";
import Extent from "@arcgis/core/geometry/Extent";

const CurrentsLayerCopernicus = ({ view }) => {
  console.log("CurrentsLayerCopernicus");
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

    // URL del servicio WMTS de Copernicus para corrientes oceánicas
    const wmtsURL = "https://wmts.marine.copernicus.eu/teroWmts?service=WMTS&request=GetCapabilities";

    // Crear la capa WMTS
    const currentsLayer = new WMTSLayer({
      url: wmtsURL,
      activeLayer: {
        id: "cmems_mod_glo_phy_anfc_0.083deg_PT1H-m", // ID de la capa obtenido de Copernicus
      },
      tileMatrixSet: "EPSG:4326",
      format: "image/png",
      style: "default",
      fullExtent: colombiaExtent,
    });

    // Agregar la capa al mapa
    view.map.add(currentsLayer);

    // Restringir la vista a la región de Colombia
    view.constraints = {
      geometry: colombiaExtent,
      minZoom: 5,
      maxZoom: 10,
    };

    // Establecer la extensión inicial
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

export default CurrentsLayerCopernicus;

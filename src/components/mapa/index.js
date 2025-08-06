import GeoJsonLayerAnimado from "./Layers/GeoJsonLayerAnimado";
import GeoJsonPostGis from "./Layers/GeoJsonPostGis";
import MapaBase from "./Basemap/MapaBase";

import CurrentsLayerCopernicus from "./Geoservicios/CurrentLayerCopernicus";
import CurrentsLayer from "./Geoservicios/CurrentLayer";
import GeoServerWMSLayer from "./Geoservicios/GeoServerWMSLayer";

import LegendWidget from "./Leyendas/LegendWidget";

import SearchWidget from "./Navegar/SearchWidget";
import CompassWidget from "./Widgetbasicos/CompassWidget";
import CoordinateConversionWidget from "./Widgetbasicos/CoordinateConversionWidget";


export{
    GeoJsonLayerAnimado,
    GeoJsonPostGis,
    MapaBase,
    
    CoordinateConversionWidget,
    CurrentsLayerCopernicus,
    CurrentsLayer,
    GeoServerWMSLayer,
    
    LegendWidget,
    
    SearchWidget,
    CompassWidget
}


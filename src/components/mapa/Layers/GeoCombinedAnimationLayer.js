import { useEffect, useRef, useState } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import { useGeojsonStore } from "../../../hook";
import capa from "./subcapa.json";
import ControlPanel from "../../controlpanel/ControlPanel";
import getCustomColorStops from "./getCustomColorStops";

const GeoCombinedAnimationLayer = ({ view, interval = 2000,ventana_layer }) => {
  const { cargarAllGeoJsonId } = useGeojsonStore();
  const [datosGeoJson, setDatosGeoJson] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [magnitudes, setMagnitudes] = useState([]);
  const geojsonLayerRef = useRef(null);
  const wmsLayerRef = useRef(null);
  const intervalRef = useRef(null);
  const subcapas = capa.subcapas;

  const dates = [
    "2107-01-00", "2107-01-01", "2107-01-02", "2107-01-03", "2107-01-04",
    "2107-01-05", "2107-01-06", "2107-01-07", "2107-01-08", "2107-01-09",
    "2107-01-10", "2107-01-11", "2107-01-12", "2107-01-13", "2107-01-14",
    "2107-01-15", "2107-01-16", "2107-01-17", "2107-01-18", "2107-01-19",
    "2107-01-20", "2107-01-21", "2107-01-22", "2107-01-23"
  ];
///////////////////////////////////////////////////////////////////////////////////////////
  // Cargar datos GeoJSON
  const cargarDatos = async () => {
    try {
      const allDatos = await Promise.all(subcapas.map(id => cargarAllGeoJsonId(id)));
      const datosValidos = allDatos.filter(d => d?.featureCollection);
      setDatosGeoJson(datosValidos);
    } catch (error) {
      console.error("❌ Error cargando GeoJSON:", error);
    }
  };
///////////////////////////////////////////////////////////////////////////////////////////
  // Cargar capa GeoJSON
  const cargarCapaGeoJSON = (index) => {
    if (geojsonLayerRef.current) {
      view.map.remove(geojsonLayerRef.current);
    }

    const datos = datosGeoJson[index];
    const features = datos.featureCollection.features || [];
    const mags = features.map(f => f.properties?.magnitude).filter(m => m !== undefined);
    setMagnitudes(mags);
    const min = Math.min(...mags);
    const max = Math.max(...mags);

    const renderer = {
      type: "simple",
      symbol: { type: "simple-marker", size: 6, outline: { color: "white", width: 0.5 } },
      visualVariables: [{ type: "color", field: "magnitude", stops: getCustomColorStops(min, max) }]
    };

    const blob = new Blob([JSON.stringify(datos.featureCollection)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const geojsonLayer = new GeoJSONLayer({
      url,
      renderer,
      popupTemplate: {
        title: "Información del Punto",
        content: (feature) => {
          const magnitude = feature.graphic.attributes?.magnitude;
          return magnitude ? `<b>Magnitud:</b> ${magnitude}` : "No se pudo obtener la magnitud.";
        }
      }
    });

    geojsonLayerRef.current = geojsonLayer;
    view.map.add(geojsonLayer);
    geojsonLayer.when(() => view.goTo(geojsonLayer.fullExtent));
  };
///////////////////////////////////////////////////////////////////////////////////////////
  // Crear capa WMS una vez
  useEffect(() => {
    if (!view || !view.map) return;

    const layer = new WMSLayer({
      url: "http://localhost:8080/geoserver/Dimar/wms",
      sublayers: [{
        name: "Dimar:geoserver",
        customParameters: { format: "image/png", transparent: true }
      }],
      opacity: 0.95,
      title: "🌍 Capa WMS Animada"
    });

    view.map.add(layer);
    wmsLayerRef.current = layer;

    return () => {
      if (view.map.layers.includes(layer)) view.map.remove(layer);
    };
  }, [view]);
///////////////////////////////////////////////////////////////////////////////////////////
  // Animación general
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % Math.max(datosGeoJson.length, dates.length));
      }, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, datosGeoJson.length, dates.length]);
///////////////////////////////////////////////////////////////////////////////////////////
  // Cargar capa GeoJSON y actualizar WMS en cada cambio de índice
  useEffect(() => {
    if (!view || !datosGeoJson.length) return;

    cargarCapaGeoJSON(currentIndex);

    const newDate = dates[currentIndex];
    const wmsLayer = wmsLayerRef.current;
    if (wmsLayer?.sublayers.length > 0) {
      wmsLayer.customParameters = {
        ...wmsLayer.customParameters,
        time: newDate
      };
      wmsLayer.load().then(() => wmsLayer.refresh());
    }
  }, [currentIndex, datosGeoJson]);
///////////////////////////////////////////////////////////////////////////////////////////
  const stopAnimation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
///////////////////////////////////////////////////////////////////////////////////////////
  const restartAnimation = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
  };
///////////////////////////////////////////////////////////////////////////////////////////
  // Cargar datos una vez al inicio
  useEffect(() => {
    cargarDatos();
  }, []);
///////////////////////////////////////////////////////////////////////////////////////////
if (!ventana_layer) {
  console.log(ventana_layer); 
  return null;
}
  return (
    <ControlPanel
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      stopAnimation={stopAnimation}
      restartAnimation={restartAnimation}
      datosGeoJsonLength={datosGeoJson.length}
      name={datosGeoJson[currentIndex]?.name}
      rango={magnitudes.length > 0 ? `${Math.min(...magnitudes)} - ${Math.max(...magnitudes)}` : "Sin datos"}
    />
  );
};

export default GeoCombinedAnimationLayer;

import { useEffect, useRef, useState } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import { useGeojsonStore } from "../../../hook";
import capa from './subcapa.json';
import ControlPanel from "../../controlpanel/ControlPanel";
import getCustomColorStops from './getCustomColorStops';
const GeoJsonPostGis = ({view}) => {
  
  const { cargarAllGeoJsonId } = useGeojsonStore();
  const [datosGeoJson, setDatosGeoJson] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [magnitudes, setMagnitudes] = useState([]);
  const geojsonLayerRef = useRef(null);
  const intervalRef = useRef(null);
  const subcapas = capa.subcapas;

  const cargarDatos = async () => {
    try {
      const allDatos = await Promise.all(subcapas.map(id => cargarAllGeoJsonId(id)));
      const datosValidos = allDatos.filter(dato => dato?.featureCollection);
      setDatosGeoJson(datosValidos);
      
    } catch (error) {
      console.error("❌ Error al cargar los datos de GeoJSON:");
    }
  };
////////////////////////////////////////////////////////////////////////////////////
  const cargarCapa = (index) => {
    if (geojsonLayerRef.current) {
      view.map.remove(geojsonLayerRef.current);
    }
    const datos = datosGeoJson[index];
    const features = datos.featureCollection.features || [];
    const magnitudes = features.map(f => f.properties?.magnitude).filter(m => m !== undefined);
    setMagnitudes(magnitudes);
    const min = Math.min(...magnitudes);
    const max = Math.max(...magnitudes);

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
////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!view || !datosGeoJson.length) return;
    cargarCapa(currentIndex);
  }, [view, datosGeoJson, currentIndex]);
////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % datosGeoJson.length);
      },2000); 
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, datosGeoJson.length]);
////////////////////////////////////////////////////////////////////////////////////
  const stopAnimation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
////////////////////////////////////////////////////////////////////////////////////
  const restartAnimation = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
  };
////////////////////////////////////////////////////////////////////////////////////
useEffect(() => {
  cargarDatos();
}, []);
////////////////////////////////////////////////////////////////////////////////////
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

export default GeoJsonPostGis;

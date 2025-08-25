import React, { useEffect, useRef, useState, createContext } from "react";
import PropTypes from "prop-types";
import { Viewer, Ion, createWorldImageryAsync, Rectangle } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { getEnvVariables } from "../../../../../helpers/getEnvVariables";
import LoadTileset from "../../../../../components/mapa/Canales/Puertos/LoadTileset";

window.CESIUM_BASE_URL = "/cesium";
Ion.defaultAccessToken = getEnvVariables().VITE_CESIUM_TOKEN;

export const CesiumContext = createContext({ viewer: null, isReady: false });

const MapaCesium = ({
  children,
  exaggeration = 1,
  relHeight = 0,
  pointCloudOptions = {},
  onViewerReady,
}) => {
  const cesiumRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Inicializar Cesium Viewer
  useEffect(() => {
    if (!cesiumRef.current) return;

    const v = new Viewer(cesiumRef.current, {
      timeline: false,
      animation: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      geocoder: false,
      terrainProvider: undefined,
      homeButton: true,
      fullscreenButton: false,
      navigationHelpButton: false,
    });

    // Cargar capa de imágenes
    createWorldImageryAsync().then((imageryProvider) => {
      v.imageryLayers.removeAll();
      v.imageryLayers.addImageryProvider(imageryProvider);
    });

    // Posicionar cámara para ver todo el mundo
    v.camera.flyTo({
      destination: Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
    });

    setViewer(v);
    setIsReady(true);

    if (onViewerReady) onViewerReady(v);

    return () => {
      if (v && !v.isDestroyed()) v.destroy();
    };
  }, [cesiumRef, onViewerReady]);

  // Actualizar exageración vertical solo cuando viewer esté listo
  useEffect(() => {
    if (!viewer) return;

    viewer.scene.verticalExaggeration = exaggeration;
    viewer.scene.verticalExaggerationRelativeHeight = relHeight;
    viewer.scene.requestRender();
  }, [exaggeration, relHeight, viewer]);

  return (
    <CesiumContext.Provider value={{ viewer, isReady }}>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div ref={cesiumRef} style={{ width: "100%", height: "100%" }} />

        <style>
          {`
            .cesium-viewer-toolbar {
              top: 10px !important;
              left: 10px !important;
              right: auto !important;
            }
          `}
        </style>

        {/* LoadTileset solo cuando viewer y pointCloudOptions estén listos */}
        {/* {isReady && viewer && pointCloudOptions && (
          <LoadTileset
            viewer={viewer}
            url="/Canal/Tumaco/2025/tileset.json"
            pointCloudOptions={pointCloudOptions}
          />
        )} */}

        {isReady && viewer && children}
      </div>
    </CesiumContext.Provider>
  );
};

MapaCesium.propTypes = {
  children: PropTypes.node,
  exaggeration: PropTypes.number,
  relHeight: PropTypes.number,
  pointCloudOptions: PropTypes.object,
  onViewerReady: PropTypes.func,
};

export default MapaCesium;

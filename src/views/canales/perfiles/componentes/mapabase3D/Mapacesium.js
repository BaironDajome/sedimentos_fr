import React, { useEffect, useRef, useState, createContext } from "react";
import PropTypes from "prop-types";
import { Viewer, Ion, createWorldImageryAsync, Rectangle } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { getEnvVariables } from "../../../../../helpers/getEnvVariables";
import PointCloudControls from "../../../../../components/mapa/Canales/Puertos/PointCloudControls";
import ControlExageracion from "../../../../../components/mapa/Canales/Puertos/ControlExageracion";
import LoadTileset from "../../../../../components/mapa/Canales/Puertos//LoadTileset";

window.CESIUM_BASE_URL = "/cesium";
Ion.defaultAccessToken = getEnvVariables().VITE_CESIUM_TOKEN;

export const CesiumContext = createContext({ viewer: null, isReady: false });

const MemoExaggerationControls = React.memo(ControlExageracion);
const MemoPointCloudControls = React.memo(PointCloudControls);

const MapaCesium = ({ children }) => {
  const cesiumRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [exaggeration, setExaggeration] = useState(1);
  const [relHeight, setRelHeight] = useState(0);

  const [pointCloudOptions, setPointCloudOptions] = useState({
    maximumScreenSpaceError: 16.0,
    geometricErrorScale: 1.0,
    maximumAttenuation: undefined,
    baseResolution: undefined,
    eyeDomeLightingStrength: 1.0,
    eyeDomeLightingRadius: 1.0,
    attenuation: true,
    eyeDomeLighting: true,
  });

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

    createWorldImageryAsync().then((imageryProvider) => {
      v.imageryLayers.removeAll();
      v.imageryLayers.addImageryProvider(imageryProvider);
    });

    v.camera.flyTo({
      destination: Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
    });

    v.scene.verticalExaggeration = exaggeration;
    v.scene.verticalExaggerationRelativeHeight = relHeight;

    setViewer(v);
    setIsReady(true);

    return () => {
      if (!v.isDestroyed()) v.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewer) {
      viewer.scene.verticalExaggeration = exaggeration;
      viewer.scene.verticalExaggerationRelativeHeight = relHeight;
      viewer.scene.requestRender();
    }
  }, [exaggeration, relHeight, viewer]);

  return (
    <CesiumContext.Provider value={{ viewer, isReady }}>
      <div style={{ width: "100%", height: 790, position: "relative" }}>
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

        {/* Controles personalizados */}
        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 35,
            display: "flex",
            flexDirection: "column",
            gap: 120,
            alignItems: "flex-start",
            zIndex: 10,
          }}
        >
          <div style={{ maxWidth: 330 }}>
            <MemoExaggerationControls
              exaggeration={exaggeration}
              relHeight={relHeight}
              onExaggerationChange={setExaggeration}
              onRelHeightChange={setRelHeight}
            />
          </div>

          <div style={{ maxWidth: 300 }}>
            <MemoPointCloudControls
              options={pointCloudOptions}
              setOptions={setPointCloudOptions}
            />
          </div>
        </div>
      </div>

      {/* ✅ aquí cargas tileset con componente externo */}
      {isReady && viewer && (
        <LoadTileset
          viewer={viewer}
          url="/Canal/Tumaco/2025/tileset.json"
          pointCloudOptions={pointCloudOptions} 
        /> 
      )}

      {isReady && children}
    </CesiumContext.Provider>
  );
};

MapaCesium.propTypes = {
  children: PropTypes.node,
};

export default MapaCesium;

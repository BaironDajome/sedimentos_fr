import React, { useEffect, useRef, useState, createContext } from "react";
import PropTypes from "prop-types";
import {
  Viewer,
  Ion,
  Cartesian3,
  HeadingPitchRoll,
  Cesium3DTileset,
  createWorldImageryAsync,
  Cesium3DTileStyle,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { getEnvVariables } from "../../../../../helpers/getEnvVariables";
import ExaggerationControls from "../seleccion/ControleExageracion";
import PointCloudControls from "./PointCloudControls"; // Asegúrate de tener este archivo

window.CESIUM_BASE_URL = "/cesium";
Ion.defaultAccessToken = getEnvVariables().VITE_CESIUM_TOKEN;

const BUENAVENTURA = { lon: -78.7625, lat: 1.8089, height: 1000 };

export const CesiumContext = createContext({ viewer: null, isReady: false });

const MapaCesium = ({ children }) => {
  const cesiumRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [tileset, setTileset] = useState(null);

  // Exaggeration state
  const [exaggeration, setExaggeration] = useState(1);
  const [relHeight, setRelHeight] = useState(0);

  // Point cloud shading state
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
    });

    createWorldImageryAsync().then((imageryProvider) => {
      v.imageryLayers.removeAll();
      v.imageryLayers.addImageryProvider(imageryProvider);
    });

    v.camera.setView({
      destination: Cartesian3.fromDegrees(BUENAVENTURA.lon, BUENAVENTURA.lat, BUENAVENTURA.height),
      orientation: new HeadingPitchRoll(5.79, -0.3, 0.0009),
    });

    v.scene.verticalExaggeration = exaggeration;
    v.scene.verticalExaggerationRelativeHeight = relHeight;

    setViewer(v);
    setIsReady(true);

    return () => {
      if (!v.isDestroyed()) v.destroy();
    };
  }, []);

  // Update exaggeration when changed
  useEffect(() => {
    if (viewer) {
      viewer.scene.verticalExaggeration = exaggeration;
      viewer.scene.verticalExaggerationRelativeHeight = relHeight;
      viewer.scene.requestRender();
    }
  }, [exaggeration, relHeight, viewer]);

  // Load tileset and apply point cloud shading options
  useEffect(() => {
    if (!viewer || !isReady) return;

    let t;

    const loadTileset = async () => {
      try {
        t = await Cesium3DTileset.fromUrl("/Canal/tileset.json"); // Cambia si usas Ion
        viewer.scene.primitives.add(t);

        // Color por altura (opcional)
        t.style = new Cesium3DTileStyle({
          color: {
            conditions: [
              ["${POSITION}.z >= 100.0", "color('darkred')"],
              ["${POSITION}.z >= 50.0", "color('red')"],
              ["${POSITION}.z >= 25.0", "color('orangered')"],
              ["${POSITION}.z >= 10.0", "color('orange')"],
              ["${POSITION}.z >= 5.0", "color('gold')"],
              ["${POSITION}.z >= 2.0", "color('yellow')"],
              ["${POSITION}.z >= 1.0", "color('lightgreen')"],
              ["${POSITION}.z >= 0.5", "color('lime')"],
              ["${POSITION}.z >= 0.1", "color('cyan')"],
              ["${POSITION}.z >= 0.01", "color('lightblue')"],
              ["true", "color('blue')"],
            ],
          },
          pointSize: 3.0,
        });

        // Apply shading options
        applyPointCloudOptions(t, pointCloudOptions);

        setTileset(t);
        viewer.zoomTo(t);
      } catch (error) {
        console.error("❌ Error al cargar tileset:", error);
      }
    };

    loadTileset();

    return () => {
      if (t && !viewer.isDestroyed()) {
        viewer.scene.primitives.remove(t);
      }
    };
  }, [viewer, isReady]);

  // Apply shading when options change
  useEffect(() => {
    if (tileset) {
      applyPointCloudOptions(tileset, pointCloudOptions);
      viewer?.scene.requestRender();
    }
  }, [pointCloudOptions, tileset]);

  const applyPointCloudOptions = (tileset, options) => {
    tileset.maximumScreenSpaceError = options.maximumScreenSpaceError;
    const shading = tileset.pointCloudShading;
    shading.geometricErrorScale = options.geometricErrorScale;
    shading.maximumAttenuation = options.maximumAttenuation;
    shading.baseResolution = options.baseResolution;
    shading.eyeDomeLightingStrength = options.eyeDomeLightingStrength;
    shading.eyeDomeLightingRadius = options.eyeDomeLightingRadius;
    shading.attenuation = options.attenuation;
    shading.eyeDomeLighting = options.eyeDomeLighting;
  };

  return (
    <CesiumContext.Provider value={{ viewer, isReady }}>
      <div style={{ position: "relative", width: "100%", height: 700 }}>
        <div ref={cesiumRef} style={{ width: "100%", height: "100%" }} />

        {/* Exaggeration controls - bottom left */}
        <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 1 }}>
          <ExaggerationControls
            exaggeration={exaggeration}
            relHeight={relHeight}
            onExaggerationChange={setExaggeration}
            onRelHeightChange={setRelHeight}
          />
        </div>

        {/* Point Cloud controls - bottom right */}
        <div style={{ position: "absolute", bottom: 10, right: 10, zIndex: 1 }}>
          <PointCloudControls
            options={pointCloudOptions}
            setOptions={setPointCloudOptions}
          />
        </div>
      </div>

      {isReady && children}
    </CesiumContext.Provider>
  );
};

MapaCesium.propTypes = {
  children: PropTypes.node,
};

export default MapaCesium;

import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { getEnvVariables } from "../../../helpers/getEnvVariables";

// Configuración Cesium
if (typeof window !== "undefined") {
  window.CESIUM_BASE_URL = "/cesium";
}

Cesium.Ion.defaultAccessToken = getEnvVariables().VITE_CESIUM_TOKEN;

export default function MapaBase3D({ setView, basemapRef, pcOptions = {}, terrainOptions = {} }) {
  const viewerRef = useRef(null);
  const cesiumViewerRef = useRef(null);
  const tilesetRef = useRef(null);

  // Inicialización del viewer
  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = new Cesium.Viewer(viewerRef.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      animation: false,
      timeline: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      geocoder: false,
      baseLayerPicker: false,
    });

    cesiumViewerRef.current = viewer;

    // BaseLayerPicker
    if (basemapRef?.current) {
      basemapRef.current.innerHTML = "";
      new Cesium.BaseLayerPicker(basemapRef.current, {
        globe: viewer.scene.globe,
        imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),
      });
    }

    // Tileset
    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(2275207),
    });
    viewer.scene.primitives.add(tileset);
    tilesetRef.current = tileset;

    if (tileset.readyPromise) {
      tileset.readyPromise.then(() => viewer.zoomTo(tileset));
    }

    if (setView) setView(viewer);

    return () => {
      if (cesiumViewerRef.current && !cesiumViewerRef.current.isDestroyed()) {
        cesiumViewerRef.current.destroy();
      }
    };
  }, [setView, basemapRef]);

  // Efecto para aplicar opciones de PointCloudControls
  useEffect(() => {
    if (!tilesetRef.current) return;

    const tileset = tilesetRef.current;
    const shading = tileset.pointCloudShading;

    // Opciones de tileset
    tileset.maximumScreenSpaceError = pcOptions.maximumScreenSpaceError ?? 8;

    // Opciones de shading
    if (shading) {
      shading.geometricErrorScale = pcOptions.geometricErrorScale ?? 1;
      shading.maximumAttenuation = pcOptions.maximumAttenuation ?? 0;
      shading.baseResolution = pcOptions.baseResolution ?? 0;
      shading.eyeDomeLightingStrength = pcOptions.eyeDomeLightingStrength ?? 1;
      shading.eyeDomeLightingRadius = pcOptions.eyeDomeLightingRadius ?? 1;
      shading.attenuation = pcOptions.attenuation ?? false;
      shading.eyeDomeLighting = pcOptions.eyeDomeLighting ?? false;
    }
  }, [pcOptions]);

  // Efecto para aplicar exageración y altura relativa
  useEffect(() => {
    console.log("Aplicando opciones de terreno:", terrainOptions);
    const viewer = cesiumViewerRef.current;
    if (!viewer) return;

    const exaggeration = terrainOptions.exaggeration ?? 1;
    const relHeight = terrainOptions.relHeight ?? 0;

    // Escala vertical del terreno (exageración)
    viewer.scene.globe.terrainExaggeration = exaggeration;

    // Ajuste de altura relativa (por ejemplo mover el tileset hacia arriba)
    if (tilesetRef.current) {
      tilesetRef.current.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(0, 0, relHeight)
      );
    }
  }, [terrainOptions]);

  return (
    <div
      ref={viewerRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

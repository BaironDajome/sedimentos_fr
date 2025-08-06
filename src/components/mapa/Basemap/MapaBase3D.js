import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import Zoom from "@arcgis/core/widgets/Zoom";
import Compass from "@arcgis/core/widgets/Compass";
import NavigationToggle from "@arcgis/core/widgets/NavigationToggle";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";

const MapaBase3D = ({ setView, children }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      basemap: "satellite",
      ground: "world-elevation",
    });

    const view = new SceneView({
      container: mapRef.current,
      map,
      camera: {
        position: {
          x: -78.026,
          y: -2.68,
          z: 5000,
        },
        tilt: 65,
        heading: 0,
      },
      environment: {
        lighting: {
          directShadowsEnabled: true,
          ambientOcclusionEnabled: true,
        },
      },
    });

    view.when()
      .then(() => {
        setView(view);
        view.ui.components = ["attribution"];

        // 🧭 Brújula
        const compass = new Compass({ view });
        view.ui.add(compass, "top-left");

        // 🔍 Zoom
        const zoom = new Zoom({ view });
        view.ui.add(zoom, "bottom-left");

        // 🌐 Coordenadas del puntero
        // const coords = new CoordinateConversion({ view });
        // view.ui.add(coords, "bottom-right");

        // 🧭 Alternar navegación 2D/3D
        const navToggle = new NavigationToggle({ view });
        view.ui.add(navToggle, "top-left");
      })
      .catch((error) => {
        console.error("Error al cargar SceneView:", error);
      });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [setView]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
      }}
    >
      {children}
    </div>
  );
};

export default MapaBase3D;

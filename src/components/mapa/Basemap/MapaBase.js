import React, { useEffect, useRef } from "react";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Zoom from "@arcgis/core/widgets/Zoom";

const MapaBase = ({ setView, children }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const webMap = new WebMap({
      basemap: "satellite",
    });

    const view = new MapView({
      container: mapRef.current,
      map: webMap,
      center: [-78.026, -2.68],
      zoom: 8,
      // spatialReference: { wkid: 4326 }
    });

    view.when()
      .then(() => {
        // Asignar la vista al estado padre
        setView(view);
        view.ui.components = ["attribution"];
        // Agregar el widget de zoom en la esquina inferior izquierda
        const zoom = new Zoom({ view });
        view.ui.add(zoom, "bottom-left");
      })
      .catch((error) => {
        console.error("Error al cargar la vista:", error);
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

export default MapaBase;

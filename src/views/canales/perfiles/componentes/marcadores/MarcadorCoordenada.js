import React, { useContext, useEffect, useRef } from "react";
import {
  Cartesian3,
  Color,
  HeightReference,
  Cartesian2,
  LabelStyle,
  VerticalOrigin,
  HeadingPitchRoll,
  Transforms,
} from "cesium";
import { CesiumContext } from "../mapabase3D/Mapacesium";

// Función que retorna la configuración del modelo
const crearModelo = (glbUrl, color = Color.WHITE.withAlpha(1.0)) => ({
  model: {
    uri: glbUrl,
    scale: 2,
    minimumPixelSize: 64,
    heightReference: HeightReference.RELATIVE_TO_GROUND,
    color, // Aplica el color aquí
  },
});

// Función que retorna la posición desde coordenadas geográficas
const getPositionFromDegrees = (lon, lat, alt) => {
  return Cartesian3.fromDegrees(lon, lat, alt);
};

// Componente principal
const MarcadorCoordenada = ({
  lat,
  lon,
  alt = 0, 
  nombre = "Punto",  
  glbUrl = "/Medidor.glb", // Modelo por defecto
  color = Color.BLUE.withAlpha(1.0), // Color por defecto rojo
}) => {
  const { viewer } = useContext(CesiumContext);
  const entidadRef = useRef(null);
  const animationRef = useRef(null);
  const isAnimatingRef = useRef(true);
  const timeRef = useRef(0);

  // Verifica si el viewer es válido
  const isViewerValid = () =>
    viewer && !viewer.isDestroyed() && viewer.entities;

  // Crea la entidad completa (modelo + etiqueta)
  const crearMarcador = () => {
    if (!isViewerValid()) return null;

    const position = getPositionFromDegrees(lon, lat, alt);
    const hpr = new HeadingPitchRoll(0, 0, 0);
    const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

    return viewer.entities.add({
      name: nombre,
      description: `Ubicación: Lat ${lat}, Lon ${lon}`,
      position,
      orientation,
      ...crearModelo(glbUrl, color),
      label: {
        text: nombre,
        font: "14px sans-serif",
        fillColor: Color.WHITE,
        backgroundColor: Color.BLACK.withAlpha(0.7),
        style: LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: VerticalOrigin.BOTTOM,
        pixelOffset: new Cartesian2(0, -50),
      },
    });
  };

  // Animación flotante
    const animate = () => {
      if (!isAnimatingRef.current || !isViewerValid()) return;

      const frequency = 0.01;
      const amplitude = 10;

      timeRef.current += 1;

      const offset = Math.sin(timeRef.current * frequency) * amplitude;
      const newPosition = getPositionFromDegrees(lon, lat, alt + offset);

      if (entidadRef.current) {
        try {
          entidadRef.current.position.setValue(newPosition);
        } catch (error) {
          console.error(`[MarcadorCoordenada] Error al actualizar posición: ${error.message}`);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };  

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      isAnimatingRef.current = false;
      cancelAnimationFrame(animationRef.current);
    } else {
      isAnimatingRef.current = true;
      animate();
    }
  };

  useEffect(() => {
    if (!isViewerValid()) {
      // console.log(`[MarcadorCoordenada] Viewer no disponible - ${nombre}`);
      return;
    }

    // console.log(`[MarcadorCoordenada] Agregando marcador: ${nombre} en (${lon}, ${lat})`);

    const entidad = crearMarcador();
    if (entidad) {
      entidadRef.current = entidad;
      animate();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isAnimatingRef.current = false;
      cancelAnimationFrame(animationRef.current);

      if (entidad && isViewerValid() && viewer.entities.contains(entidad)) {
        try {
          viewer.entities.remove(entidad);
        } catch (error) {
          console.error(`[MarcadorCoordenada] Error al eliminar entidad: ${error.message}`);
        }
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [viewer, lat, lon, alt, nombre, glbUrl, color]);

  return null;
};

export default MarcadorCoordenada;
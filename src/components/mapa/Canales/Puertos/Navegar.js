// Navegar.jsx
import { useEffect, useState } from "react";
import {
  Cartesian3,
  PathGraphics,
  Color,
  SampledPositionProperty,
  JulianDate,
  VelocityOrientationProperty,
  TimeIntervalCollection,
  TimeInterval,
} from "cesium";

export default function Navegar({ viewer, glbUrl = "/boyas/barco5.glb", boyasUrl }) {
  const [posiciones, setPosiciones] = useState([]);

  // 📥 1. Cargar JSON de boyas
  useEffect(() => {
    console.log(boyasUrl);
    if (!boyasUrl) return;
    fetch(boyasUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data?.modelos?.length > 0) {
          // Tomamos la primera ruta de coordenadas del JSON
          const coords = data.modelos[0].coordenadas || [];
          setPosiciones(coords);
        }
      })
      .catch((err) => console.error("Error cargando boyas:", err));
  }, [boyasUrl]);

  // 🚢 2. Crear barco y animar movimiento
  useEffect(() => {
    if (!viewer || posiciones.length === 0) return;

    // Crear propiedad de posiciones animadas
    const position = new SampledPositionProperty();
    const start = JulianDate.now();

    posiciones.forEach((pos, i) => {
      const tiempo = JulianDate.addSeconds(start, i * 10, new JulianDate()); // cada punto en +10s
      position.addSample(
        tiempo,
        Cartesian3.fromDegrees(pos.lon, pos.lat, pos.alt || 0)
      );
    });

    // Definir intervalo de tiempo
    const stop = JulianDate.addSeconds(start, posiciones.length * 10, new JulianDate());

    // Crear la entidad del barco
    const barco = viewer.entities.add({
      id: "barco-navegando",
      availability: new TimeIntervalCollection([
        new TimeInterval({ start, stop }),
      ]),
      position,
      orientation: new VelocityOrientationProperty(position),
      model: {
        uri: glbUrl, // 🚢 modelo del barco
        minimumPixelSize: 64,
        maximumScale: 200,
      },
      path: new PathGraphics({
        resolution: 1,
        material: Color.YELLOW,
        width: 2,
      }),
    });

    // Configurar el reloj
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.multiplier = 2; // velocidad de simulación
    viewer.clock.shouldAnimate = true;

    viewer.trackedEntity = barco;

    return () => {
      viewer.entities.removeById("barco-navegando");
      viewer.trackedEntity = undefined;
    };
  }, [viewer, posiciones, glbUrl]);

  return null;
}

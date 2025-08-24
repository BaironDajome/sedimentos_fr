import { useEffect, useState } from "react";
import { Cesium3DTileset, Cesium3DTileStyle } from "cesium";

const LoadTileset = ({ viewer, url, pointCloudOptions }) => {
  const [tileset, setTileset] = useState(null);

  useEffect(() => {
    if (!viewer) return;

    let t;

    const loadTileset = async () => {
      try {
        t = await Cesium3DTileset.fromUrl(url);
        viewer.scene.primitives.add(t);

        // 🎨 estilo de colores
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

        // aplicar opciones
        applyPointCloudOptions(t, pointCloudOptions);
        setTileset(t);

        // zoom al tileset
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
  }, [viewer, url]);

  useEffect(() => {
    if (tileset && viewer) {
      applyPointCloudOptions(tileset, pointCloudOptions);
      viewer.scene.requestRender();
    }
  }, [tileset, pointCloudOptions, viewer]);

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

  return null;
};

export default LoadTileset;

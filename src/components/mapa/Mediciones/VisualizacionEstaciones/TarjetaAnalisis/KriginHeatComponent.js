import React, { useEffect, useState, useRef } from 'react';
import Graphic from '@arcgis/core/Graphic';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import { krigin, crearPoligonoConvexo } from '../../Utilitis/Helper';

export const KriginHeatComponent = ({ calor, view }) => {
  const [punto, setPunto] = useState(null);
  const [valorInterpolado, setValorInterpolado] = useState(null);
  const [modelo, setModelo] = useState('gaussian');
  const [paramA, setParamA] = useState(0.5);  // rango 0–1
  const [paramB, setParamB] = useState(50);  // rango 1–100

  const poligonoRef = useRef(null);
  const puntoGraphicRef = useRef(null);
  const labelGraphicRef = useRef(null);

  useEffect(() => {
    if (!view || !Array.isArray(calor) || calor.length === 0) return;

    const poligono = crearPoligonoConvexo(calor);
    if (!poligono) return;

    const polygonGraphic = new Graphic({
      geometry: {
        type: 'polygon',
        rings: poligono.geometry.coordinates[0],
        spatialReference: { wkid: 4326 }
      },
      symbol: {
        type: 'simple-fill',
        color: [0, 0, 255, 0.2],
        outline: { color: [255, 0, 255], width: 2 }
      }
    });

    view.graphics.add(polygonGraphic);
    poligonoRef.current = polygonGraphic;

    return () => {
      view.graphics.remove(polygonGraphic);
      poligonoRef.current = null;
    };
  }, [view, calor]);

  useEffect(() => {
    if (!view) return;

    const handleClick = (event) => {
      const point = view.toMap({ x: event.x, y: event.y });
      setPunto([point.longitude, point.latitude]);

      if (puntoGraphicRef.current) view.graphics.remove(puntoGraphicRef.current);
      if (labelGraphicRef.current) view.graphics.remove(labelGraphicRef.current);

      const marker = new Graphic({
        geometry: point,
        symbol: {
          type: 'simple-marker',
          color: 'red',
          size: 10,
          outline: { color: 'white', width: 1 }
        }
      });

      view.graphics.add(marker);
      puntoGraphicRef.current = marker;
    };

    const handler = view.on('click', handleClick);
    return () => {
      handler.remove();
      if (puntoGraphicRef.current) view.graphics.remove(puntoGraphicRef.current);
      if (labelGraphicRef.current) view.graphics.remove(labelGraphicRef.current);
    };
  }, [view]);

  useEffect(() => {
    const puntoValido = Array.isArray(punto) && punto.length === 2 &&
      typeof punto[0] === 'number' && typeof punto[1] === 'number';

    if (Array.isArray(calor) && calor.length > 0 && puntoValido) {
      const valor = krigin(calor, punto, modelo, paramA, paramB);
      setValorInterpolado(valor);

      if (valor !== null) {
        if (labelGraphicRef.current) view.graphics.remove(labelGraphicRef.current);

        const label = new Graphic({
          geometry: { type: 'point', longitude: punto[0], latitude: punto[1] },
          symbol: new TextSymbol({
            text: valor.toFixed(2),
            color: 'black',
            haloColor: 'white',
            haloSize: '1px',
            font: { size: 12, family: 'sans-serif' },
            yoffset: -20
          })
        });

        view.graphics.add(label);
        labelGraphicRef.current = label;
      }
    } else {
      setValorInterpolado(null);
    }
  }, [calor, punto, modelo, paramA, paramB]);

  return (
    <div>
      {/* <div style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <calcite-label>
          Modelo de Kriging:
          <calcite-select
            value={modelo}
            onCalciteSelectChange={(e) => setModelo(e.target.value)}
          >
            <calcite-option value="gaussian">Gaussian</calcite-option>
            <calcite-option value="exponential">Exponential</calcite-option>
            <calcite-option value="spherical">Spherical</calcite-option>
          </calcite-select>
        </calcite-label>

        <calcite-label>
          Sigma(0-1)
          <calcite-slider
            min="0"
            max="1"
            step="0.01"
            value={paramA}
             onCalciteSliderChange={(e) => setParamA(e.target.valueAsNumber)}
          ></calcite-slider>
        </calcite-label>

        <calcite-label>
          Alpha (1–100)
          <calcite-slider
            min="1"
            max="100"
            step="1"
            value={paramB}
            onCalciteSliderChange={(e) => setParamB(e.target.valueAsNumber)}
          ></calcite-slider>
        </calcite-label>
      </div> */}
    </div>
  );
};

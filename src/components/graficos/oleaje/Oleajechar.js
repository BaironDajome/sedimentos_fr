import React, { useEffect, useState } from 'react';
import { VegaLite } from 'react-vega';
import * as vl from 'vega-lite-api';

const Oleajechar = ({ data }) => {
  const [spec, setSpec] = useState(null);
  const width = 550;
  const height = 250;
  console.log(data);
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Gráfico principal: arcos de la rosa de vientos
    const mainChart = vl
      .markArc({ innerRadius: 0, outerRadius: 120, tooltip: true })
      .data(data)
      .encode(
        vl.theta().fieldN('direccionBin').title(null),
        vl.radius().aggregate('count').title('Frecuencia'),
        vl.color()
          .fieldQ('valor')
          .title('Hs [m]')
          .bin({ maxbins: 5 })
          .scale({
            range: ['#cce5ff', '#66b2ff', '#0073e6', '#004c99'] // Tonos de azul
          }),
        vl.tooltip([
          { field: 'direccion', type: 'quantitative', title: 'Dirección (°)' },
          { field: 'valor', type: 'quantitative', title: 'Hs (m)' },
        ])
      )
      .transform([
        {
          calculate: `round(datum.direccion / 30) * 30`,
          as: 'direccionBin',
        }
      ])
      .width(width)
      .height(height)
      .view({ stroke: 'transparent' });

    // Etiquetas de direcciones cardinales
    const direccionesCardinales = [
      { label: 'N', angle: 0 },
      { label: 'NE', angle: 45 },
      { label: 'E', angle: 90 },
      { label: 'SE', angle: 135 },
      { label: 'S', angle: 180 },
      { label: 'SW', angle: 225 },
      { label: 'W', angle: 270 },
      { label: 'NW', angle: 315 }
    ];

    const cardinalLabels = {
      data: { values: direccionesCardinales },
      mark: { type: 'text', align: 'center', baseline: 'middle' },
      encoding: {
        theta: { field: 'angle', type: 'quantitative' },
        radius: { value: 130 }, // Ajustado ligeramente mayor que outerRadius
        text: { field: 'label', type: 'nominal' },
        size: { value: 12 }
      }
    };

    // Marco circular exterior
    const circularFrame = {
      mark: { type: 'arc', stroke: '#999', strokeWidth: 1, fill: null },
      data: { values: [{ startAngle: 0, endAngle: 6.29 }] },
      encoding: {
        theta: { field: 'startAngle', type: 'quantitative' },
        theta2: { field: 'endAngle', type: 'quantitative' },
        radius: { value: 100 } // Ajustado ligeramente mayor que outerRadius
      }
    };

    // Especificación completa del gráfico
    const fullSpec = {
      width,
      height,
      layer: [
        mainChart.toSpec(),
        cardinalLabels,
        circularFrame
      ],
      config: {
        view: {
          stroke: null,
          actions: false // Oculta las acciones
        }
      }
    };

    setSpec(fullSpec);
  }, [data]);

  return spec ? (
    <VegaLite
      spec={spec}
      actions={false} // Opción clave para ocultar las acciones
    />
  ) : null;
};

export default Oleajechar;
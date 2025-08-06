import React, { useEffect, useState } from 'react';
import { VegaLite } from 'react-vega';
import * as vl from 'vega-lite-api';

export const ProfileChart = ({ data, onBrush, onClick }) => {
  const [spec, setSpec] = useState(null);
  const width = 450;
  const height = 180;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const maxValor = data.reduce((max, d) => Math.max(max, d.valor), 0);

    const brush = {
      name: 'brush',
      select: { type: 'interval', encodings: ['x'] }
    };

    const click = {
      name: 'click',
      select: { type: 'point', encodings: ['x', 'y'] }
    };

    const tipoClick = {
      name: 'tipoClick',
      select: { type: 'point', encodings: ['y'] },
      empty: false
    };

    const chartMain = vl
      .markPoint({ filled: true, tooltip: true })
      .encode(
        vl.y().fieldQ('profundidad').title('Profundidad (m)').scale({ zero: false }),
        vl.x().fieldQ('valor').title('Rango (°C / PSU)').scale({ zero: false }),
        vl.color().fieldN('tipoConUnidad').title('Tipo').scale({
          domain: ['Temperatura (°C)', 'Salinidad (PSU)'],
          range: ['#ff7f0e', '#1f77b4'],
        }),
        vl.size().fieldQ('valor')
          .scale({ domain: [0, maxValor], range: [30, 150] })
          .legend(null), // 🔴 Eliminar la leyenda de tamaño
        vl.tooltip([
          { field: 'profundidad', type: 'quantitative', title: 'Profundidad (m)' },
          { field: 'valorConUnidad', type: 'nominal', title: 'Valor' },
          { field: 'tipoConUnidad', type: 'nominal', title: 'Tipo' },
          {
            field: 'hora',
            type: 'temporal',
            title: 'Fecha y Hora',
            timeUnit: 'yearmonthdatehoursminutes',
            format: '%d/%m/%Y %H:%M'
          },
        ])
      )
      .width(width)
      .height(height)
      .params([brush, click])
      .transform([
        {
          calculate: `datum.tipo === 'Temperatura' ? datum.valor + ' °C' : datum.valor + ' PSU'`,
          as: 'valorConUnidad',
        },
        {
          calculate: `datum.tipo === 'Temperatura' ? 'Temperatura (°C)' : 'Salinidad (PSU)'`,
          as: 'tipoConUnidad',
        },
        { filter: { param: 'tipoClick', empty: true } }
      ]);

    const chartBar = vl
      .markBar({ opacity: 0.6 })
      .encode(
        vl.x().fieldQ('total').title('Total Valor'),
        vl.y().fieldN('tipoConUnidad').title('Tipo'),
        vl.color().fieldN('tipoConUnidad').scale({
          domain: ['Temperatura (°C)', 'Salinidad (PSU)'],
          range: ['#ff7f0e', '#1f77b4'],
        })
      )
      .width(width)
      .height(height - 150)
      .params([brush, tipoClick])
      .transform([
        {
          calculate: `datum.tipo === 'Temperatura' ? 'Temperatura (°C)' : 'Salinidad (PSU)'`,
          as: 'tipoConUnidad',
        },
        { filter: { param: 'brush' } },
        {
          aggregate: [{ op: 'mean', field: 'valor', as: 'total' }],
          groupby: ['tipoConUnidad'],
        },
      ]);

    const processedSpec = vl
      .vconcat(chartMain, chartBar)
      .data(data)
      .config({ view: { stroke: 'transparent' }, selection: null })
      .toSpec();

    setSpec(processedSpec);
  }, [data]);

  const handleNewView = (view) => {
    view.addEventListener('click', (event, item) => {
      if (item && item.datum) {
        onClick?.(item.datum);
      }
    });

    view.addSignalListener('brush', (name, value) => {
      const brushRange = value ? value.profundidad : null;
      if (brushRange) {
        onBrush?.(brushRange);
      } else {
        onBrush?.(null);
      }
    });
  };

return spec ? (
  <VegaLite spec={spec} actions={false} onNewView={handleNewView} style={{ width: '100%' }} />
) : (
  <div>Cargando...</div>
);
};

export default ProfileChart;

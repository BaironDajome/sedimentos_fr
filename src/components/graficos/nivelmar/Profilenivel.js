import React, { useEffect, useState } from 'react';
import { VegaLite } from 'react-vega';
import * as vl from 'vega-lite-api';

export const ProfileNivel = ({ data, onBrush, onClick }) => {
  const [spec, setSpec] = useState(null);
  const width = 550;
  const height = 170;

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Definimos la selección por brush (sin bind: 'scales')
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
      select: { type: 'point', encodings: ['color'] },
      empty: false
    };

    // Gráfico principal - valores vs tiempo
    const chartMain = vl
      .markPoint({ filled: true, tooltip: true })
      .encode(
        vl.x().fieldT('hora').title('Fecha y Hora'),
        vl.y().fieldQ('valor').title('Altura (m)'),
        vl.color().fieldN('tipo').title('Tipo'),
        vl.size().value(60),
        vl.tooltip([
          { field: 'hora', type: 'temporal', title: 'Fecha y Hora', timeUnit: 'yearmonthdatehoursminutes', format: '%d/%m/%Y %H:%M' },
          { field: 'valor', type: 'quantitative', title: 'Altura (m)' },
          { field: 'tipo', type: 'nominal', title: 'Tipo' }
        ])
      )
      .width(width)
      .height(height)
      .params([brush, click])
      .transform([{ filter: { param: 'tipoClick', empty: true } }]);

    // Gráfico de barras - promedio por tipo
    const chartBar = vl
      .markBar()
      .encode(
        vl.x().fieldQ('promedio').title('Promedio Altura (m)'),
        vl.y().fieldN('tipo').title('Tipo'),
        vl.color().fieldN('tipo')
      )
      .width(width)
      .height(height - 120)
      .params([tipoClick])
      .transform([
        { filter: { param: 'brush' } },
        {
          aggregate: [{ op: 'mean', field: 'valor', as: 'promedio' }],
          groupby: ['tipo']
        }
      ]);

    // Combinamos los dos gráficos
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
      onBrush?.(value ? value.hora : null);
    });
  };

  return spec ? (
    <VegaLite spec={spec} actions={false} onNewView={handleNewView} />
  ) : (
    <div>Cargando...</div>
  );
};

export default ProfileNivel;
import React, { useEffect, useState } from 'react';
import { VegaLite } from 'react-vega';
import * as vl from 'vega-lite-api';

const Corrientechar = ({ data }) => {
  const [spec, setSpec] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null); // Para mostrar datos al hacer clic

  const width = 550;
  const height = 200;

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    const flattenedData = data.map(item => ({
      timestamp: item.hora,
      nivel: item.nivel,
      corrientex: item.corrientex,
      corrientey: item.corrientey,
      velocidad: item.corriente
    }));

    // Configuración base del gráfico con rectángulos
    const base = vl
      .markRect({ filled: true })
      .encode(
        vl.x().fieldT('timestamp').timeUnit('hoursminutes').title('Tiempo'),
        vl.y().fieldQ('nivel').title('Nivel [m]'),
        vl.color()
          .fieldQ('value')
          .scale({ scheme: 'viridis' })
          .title('Magnitud [m/s]')
          .legend({ labelAngle: -90 })
      )
      .width(width)
      .height(height);

    // Capa de texto para mostrar valores debajo de cada celda
    const textLayer = vl
      .markText({
        dy: 15, // Desplazamiento vertical hacia abajo
        fontSize: 10,
        baseline: 'top', // Alinear texto hacia arriba
        color: 'white',
      })
      .encode(
        vl.x().fieldT('timestamp').timeUnit('hoursminutes'), // Mismo eje x
        vl.y().fieldQ('nivel'), // Mismo eje y
        vl.text().fieldQ('value') // Mostrar el valor como texto
      );

    // Combinar capas: rectángulo + texto
    const combinedSpec = vl.layer([base, textLayer]);

    // Panel Velocidad
    const panelVel = combinedSpec
      .data(flattenedData.map(d => ({ ...d, value: d.velocidad })))
      .title('Magnitud Velocidad');

    // Panel Componente u
    const panelU = combinedSpec
      .data(flattenedData.map(d => ({ ...d, value: d.corrientex })))
      .title('Componente u');

    // Panel Componente v
    const panelV = combinedSpec
      .data(flattenedData.map(d => ({ ...d, value: d.corrientey })))
      .title('Componente v');

    // Especificación final con barra de color compartida
    const fullSpec = {
      vconcat: [
        panelU.toSpec(),
        panelV.toSpec(),
        panelVel.toSpec()
      ],
      resolve: {
        scale: {
          color: 'shared'
        }
      },
      config: {
        view: {
          stroke: null
        }
      }
    };

    setSpec(fullSpec);
  }, [data]);

  return spec ? (
    <div style={{ padding: '20px' }}>
      {/* Gráfico VegaLite con evento de tooltip */}
      <div
        onMouseLeave={() => setSelectedValue(null)}
        style={{ width: `${width}px` }}
      >
        <VegaLite
          spec={spec}
          actions={false}
          onTooltip={(event) => {
            if (event?.type === 'mark') {
              setSelectedValue(event.datum);
            }
          }}
        />
      </div>

      {/* Tarjeta con información del valor seleccionado */}
      {selectedValue && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f0f8ff',
          border: '1px solid #90caf9',
          borderRadius: '8px',
          maxWidth: '300px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h4>Dato Seleccionado</h4>
          <p><strong>Tiempo:</strong> {new Date(selectedValue.timestamp).toLocaleTimeString()}</p>
          <p><strong>Nivel:</strong> {selectedValue.nivel}</p>
          <p><strong>Magnitud:</strong> {parseFloat(selectedValue.value).toFixed(2)} m/s</p>
        </div>
      )}
    </div>
  ) : (
    <p>Cargando...</p>
  );
};

export default Corrientechar;
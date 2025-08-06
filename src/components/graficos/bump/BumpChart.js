// BumpChart.js
import React from 'react';
import { ResponsiveBump } from '@nivo/bump';

const BumpChart = ({ data }) => {
  return (
    <div style={{ height: 250 }}>
      <ResponsiveBump
        data={data}
        colors={{ scheme: 'category10' }}
        lineWidth={3}
        activeLineWidth={6}
        inactiveLineWidth={3}
        inactiveOpacity={0.15}
        pointSize={10}
        activePointSize={16}
        inactivePointSize={0}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={3}
        pointBorderColor={{ from: 'serie.color' }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: -36,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Tiempos',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Rango',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default BumpChart;

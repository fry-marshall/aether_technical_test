import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = ({data}) => {
  const data_ = {
    labels: Array.from({ length: 20 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Cost ($/kWh)',
        data,
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Cost ($/kWh)',
        },
      },
    },
  };

  return <div style={{width: '500px'}}>
    <Line data={data_} options={options} />
  </div>;
};

export default LineChart;
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import {calculateCostForTheFirstYear} from './tariff-price-easymethod'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function chartData(energyratestructure, consumption, escalator){
  console.log(escalator)
  const data = [parseFloat(calculateCostForTheFirstYear(energyratestructure, consumption))]
  console.log(data)
  for(let i = 1; i < 20; i++){
    const value = data[i-1] + data[i-1]*(escalator/100)
    data.push(value)
  }
  console.log(data)
  return data
}

const LineChart = ({energyratestructure, consumption, escalator}) => {
  const data_ = {
    labels: Array.from({ length: 20 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Cost',
        data: chartData(energyratestructure, consumption, escalator),
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
          text: 'Cost',
        },
      },
    },
  };

  return <div style={{width: '500px'}}>
    <Line data={data_} options={options} />
  </div>;
};

export default LineChart;
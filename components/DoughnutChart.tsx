'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Create a media query list for detecting dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial value based on the user's preference
    setIsDarkMode(mediaQuery.matches);

    // Define a callback function that updates the state when the preference changes
    const handleChange = (e: any) => setIsDarkMode(e.matches);

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up the event listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

const DoughnutChart = ({ title, data }: DoughnutChartProps) => {
  const isDarkMode = useDarkMode();

  const chartData = {
    datasets: [
      {
        label: title,
        data: data.map((item) => item.count),
        backgroundColor: data.map((item) => item.color),
        // spacing: data.map((item) => '50px'),
      },
    ],
    labels: data.map((item) => item.type),
    hoverOffset: 4,
    spacing: 2,
  };

  return (
    <Doughnut
      data={chartData}
      options={{
        cutout: '5%',
        radius: '60%',

        // borderRadius: 3,
        borderColor: isDarkMode ? 'rgb(31 41 55)' : 'rgb(255, 255, 255)',
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;

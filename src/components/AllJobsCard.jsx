import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const tabs = ['Daily', 'Weekly', 'Monthly'];

const AllJobsCard = () => {
  const [selectedTab, setSelectedTab] = useState('Monthly');

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Jobs',
        data: [120, 190, 300, 500, 200, 300, 400],
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawBorder: false },
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div className="col-md-6">
      <div className="p-4 bg-white rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">All Jobs</h5>
          <div className="btn-group btn-group-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`btn ${selectedTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '250px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default AllJobsCard;

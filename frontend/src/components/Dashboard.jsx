import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getSales, getForecasts, generateForecast } from '../services/api';
import ReportExport from './ReportExport';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const salesRes = await getSales();
            const forecastRes = await getForecasts();
            setSales(salesRes.data);
            setForecasts(forecastRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGenerateForecast = async () => {
        setLoading(true);
        try {
            await generateForecast();
            await fetchData();
        } catch (error) {
            console.error("Error generating forecast");
        }
        setLoading(false);
    };

    // Prepare Chart Data
    // Aggregate sales by month
    const salesByMonth = {};
    sales.forEach(s => {
        const month = s.date.slice(0, 7); // YYYY-MM
        salesByMonth[month] = (salesByMonth[month] || 0) + s.quantity;
    });

    // Merge Forecasts
    const forecastByMonth = {};
    forecasts.forEach(f => {
        forecastByMonth[f.forecastMonth] = f.predictedDemand;
    });

    const labels = [...new Set([...Object.keys(salesByMonth), ...Object.keys(forecastByMonth)])].sort();

    const data = {
        labels,
        datasets: [
            {
                label: 'Historical Sales',
                data: labels.map(l => salesByMonth[l] || null),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'AI Forecast',
                data: labels.map(l => forecastByMonth[l] || null),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderDash: [5, 5],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales History vs AI Forecast',
            },
        },
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Dashboard</h2>
                <button onClick={handleGenerateForecast} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {loading ? 'Analyzing...' : 'Generate New Forecast'}
                </button>
            </div>

            <div style={{ height: '400px', margin: '20px 0' }}>
                <Line options={options} data={data} />
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Inventory Alerts & Forecasts (By Region)</h3>
                {forecasts.map(f => {
                    // Mock logic: Assume reorder needed if demand > 50 (Since we don't have currentStock in forecast yet, fetching it or mocking)
                    // Ideally we should have currentStock in the forecast object or joined.
                    // For this task, we will show all forecasts but highlight High Priority ones.
                    const isHighPriority = f.predictedDemand > 50;

                    return (
                        <div key={f._id} style={{
                            padding: '10px',
                            borderLeft: isHighPriority ? '4px solid #f44336' : '4px solid #4caf50',
                            backgroundColor: '#333',
                            marginBottom: '10px',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>Region: {f.region} ({f.forecastMonth})</strong>
                                <span style={{
                                    backgroundColor: isHighPriority ? '#f44336' : '#4caf50',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8em'
                                }}>
                                    {isHighPriority ? 'REORDER RECOMMENDED' : 'STOCK HEALTHY'}
                                </span>
                            </div>
                            <p style={{ margin: '5px 0' }}>Predicted Demand: {f.predictedDemand} units</p>
                            <span style={{ color: '#ccc', fontSize: '0.9em' }}>Confidence: {Math.round(f.confidenceScore * 100)}%</span>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', fontStyle: 'italic' }}>"{f.aiReasoning}"</p>
                        </div>
                    );
                })}
                {forecasts.length === 0 && <p>No forecasts generated yet.</p>}
            </div>

            <ReportExport forecasts={forecasts} />
        </div>
    );
};

export default Dashboard;

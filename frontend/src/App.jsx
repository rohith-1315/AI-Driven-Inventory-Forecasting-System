import React, { useState } from 'react';
import UploadSales from './components/UploadSales';
import Dashboard from './components/Dashboard';

function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [showDashboard, setShowDashboard] = useState(false);

    const handleUploadSuccess = () => {
        setRefreshKey(old => old + 1);
        setShowDashboard(true);
    };

    return (
        <div className="container">
            <h1>AI Inventory Forecasting</h1>
            <UploadSales onUploadSuccess={handleUploadSuccess} />
            {showDashboard && <Dashboard key={refreshKey} />}
        </div>
    )
}

export default App;

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function verify() {
    console.log('Starting Verification...');

    // 1. Upload CSV
    try {
        const form = new FormData();
        const csvPath = path.join(__dirname, '../sample_sales.csv');
        form.append('file', fs.createReadStream(csvPath));

        console.log('Uploading CSV...');
        const uploadRes = await axios.post(`${API_URL}/upload`, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Upload Result:', uploadRes.data);
    } catch (error) {
        console.error('Upload Failed:', error.response ? error.response.data : error.message);
        return;
    }

    // 2. Get Products
    try {
        console.log('Fetching Products...');
        const productsRes = await axios.get(`${API_URL}/products`);
        console.log(`Found ${productsRes.data.length} products.`);
        if (productsRes.data.length === 0) throw new Error('No products found');
    } catch (error) {
        console.error('Get Products Failed:', error.message);
    }

    // 3. Generate Forecast
    try {
        console.log('Generating Forecast...');
        const forecastRes = await axios.post(`${API_URL}/forecast`, {});
        console.log('Forecast Result:', forecastRes.data.message);
        console.log(`Generated ${forecastRes.data.forecasts.length} forecasts.`);
    } catch (error) {
        console.error('Forecast Failed:', error.message);
    }

    // 4. Get Forecasts
    try {
        const forecastsRes = await axios.get(`${API_URL}/forecasts`);
        console.log(`Total Forecasts in DB: ${forecastsRes.data.length}`);
        if (forecastsRes.data.length > 0) {
            console.log('First Forecast Sample:', forecastsRes.data[0]);
        }
    } catch (error) {
        console.error('Get Forecasts Failed:', error.message);
    }

    console.log('Verification Complete.');
}

verify();

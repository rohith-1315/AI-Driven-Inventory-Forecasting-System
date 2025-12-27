import axios from 'axios';

const API_URL = '/api';

export const uploadSales = (formData) => {
    return axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getSales = () => {
    return axios.get(`${API_URL}/sales`);
};

export const getForecasts = () => {
    return axios.get(`${API_URL}/forecasts`);
};

export const generateForecast = () => {
    return axios.post(`${API_URL}/forecast`, {});
};

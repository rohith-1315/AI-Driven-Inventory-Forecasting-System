import React, { useState } from 'react';
import { uploadSales } from '../services/api';

const UploadSales = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a CSV file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setMessage('Uploading...');
            await uploadSales(formData);
            setMessage('Upload Successful!');
            onUploadSuccess();
        } catch (error) {
            console.error(error);
            setMessage('Error uploading file.');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Step 1: Upload Sales Data</h2>
            <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginLeft: '10px', padding: '10px 20px' }}>Upload File</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadSales;

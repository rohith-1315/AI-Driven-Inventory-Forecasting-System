const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_forecast';
console.log('Attempting to connect to MongoDB at:', mongoURI);

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Inventory Forecasting API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

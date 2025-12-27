const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    region: { type: String, default: 'Global' },
    forecastMonth: { type: String, required: true }, // Format: YYYY-MM
    predictedDemand: { type: Number, required: true },
    confidenceScore: Number,
    aiReasoning: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forecast', forecastSchema);

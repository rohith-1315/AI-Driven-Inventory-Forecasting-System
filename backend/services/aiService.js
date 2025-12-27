const axios = require('axios');

exports.predictDemand = async (product, salesHistory, region = 'Global') => {
    // If API KEY is present, call Claude/OpenAI. Else, mock.
    const apiKey = process.env.AI_API_KEY;

    // Aggregate sales by month for context
    const salesSummary = salesHistory.map(s => `${s.date.toISOString().split('T')[0]}: ${s.quantity}`).join('\n');

    if (!apiKey) {
        // Mock Logic
        console.log('No API Key found. Using Mock Prediction logic.');
        const lastSale = salesHistory[salesHistory.length - 1];
        const nextMonthDate = new Date(lastSale.date);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const monthStr = nextMonthDate.toISOString().slice(0, 7); // YYYY-MM

        // Simple mock: average of last 3 sales * 1.1 growth
        const recentSales = salesHistory.slice(-3);
        const avg = recentSales.reduce((sum, s) => sum + s.quantity, 0) / recentSales.length;

        return {
            month: monthStr,
            demand: Math.round(avg * 1.1),
            confidence: 0.85,
            reasoning: `Based on 10% projected growth from recent average in ${region} (Mock).`
        };
    }

    try {
        // Integration with Google Gemini API
        // Using generateContent REST endpoint
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            contents: [{
                parts: [{
                    text: `You are an inventory forecasting expert. Predict the demand for the next month based on this sales history for product "${product.name}" in region "${region}":
                    
                    ${salesSummary}
                    
                    Return JSON only with format: {"demand": number, "confidence": number (0-1), "reasoning": "string"}`
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Gemini response structure
        const candidate = response.data.candidates[0];
        const text = candidate.content.parts[0].text;

        // Parse JSON from text
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);

            // Determine next month
            const lastSale = salesHistory[salesHistory.length - 1];
            const nextMonthDate = new Date(lastSale.date);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            const monthStr = nextMonthDate.toISOString().slice(0, 7);

            return {
                month: monthStr,
                demand: result.demand,
                confidence: result.confidence,
                reasoning: result.reasoning
            };
        }
    } catch (error) {
        console.error('AI Service Error (Switched to Mock):', error.response ? JSON.stringify(error.response.data) : error.message);
        // Fallback to Mock Logic
        return generateMockPrediction(salesHistory, region);
    }
    return null;
};

function generateMockPrediction(salesHistory, region) {
    const lastSale = salesHistory[salesHistory.length - 1];
    const nextMonthDate = new Date(lastSale.date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const monthStr = nextMonthDate.toISOString().slice(0, 7);

    const recentSales = salesHistory.slice(-3);
    const avg = recentSales.reduce((sum, s) => sum + s.quantity, 0) / recentSales.length;

    return {
        month: monthStr,
        demand: Math.round(avg * 1.1),
        confidence: 0.85,
        reasoning: `Based on 10% projected growth from recent average in ${region} (Mock - API Failed).`
    };
}

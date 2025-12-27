const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Forecast = require('../models/Forecast');
const csv = require('csv-parser');
const fs = require('fs');
const aiService = require('../services/aiService');

const xlsx = require('xlsx');

exports.uploadSales = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const isCsv = req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv');
    const isExcel = req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || req.file.originalname.endsWith('.xlsx');

    if (!isCsv && !isExcel) {
        return res.status(400).send('Invalid file format. Please upload a CSV or Excel (.xlsx) file.');
    }

    const processData = async (results) => {
        try {
            // Expected columns: ProductID, ProductName, Date, Quantity, Region, Revenue
            let addedSales = 0;
            for (const row of results) {
                // Find or create product
                let product = await Product.findOne({ sku: row.ProductID });
                if (!product) {
                    product = new Product({
                        name: row.ProductName,
                        sku: row.ProductID,
                        category: 'Uncategorized',
                        currentStock: 0 // Default
                    });
                    await product.save();
                }

                // Create Sale record
                const sale = new Sale({
                    productId: product._id,
                    date: new Date(row.Date),
                    quantity: parseInt(row.Quantity),
                    region: row.Region,
                    revenue: parseFloat(row.Revenue || 0)
                });
                await sale.save();
                addedSales++;
            }

            // Cleanup temp file
            fs.unlinkSync(req.file.path);

            res.json({ message: `Successfully processed ${addedSales} sales records.` });
        } catch (error) {
            console.error('Data Processing Error:', error);
            if (error.errors) console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
            res.status(500).send('Error processing data: ' + error.message);
        }
    };

    if (isExcel) {
        try {
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const results = xlsx.utils.sheet_to_json(sheet);
            await processData(results);
        } catch (error) {
            console.error('Excel Parsing Error:', error);
            res.status(500).send('Error parsing Excel file: ' + error.message);
        }
    } else {
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
            .on('data', (data) => results.push(data))
            .on('end', async () => await processData(results));
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate('productId');
        res.json(sales);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.generateForecast = async (req, res) => {
    try {
        const { productId } = req.body; // Optional

        let products = [];
        if (productId) {
            products = await Product.find({ _id: productId });
        } else {
            products = await Product.find();
        }

        const forecasts = [];

        for (const product of products) {
            // Fetch all sales
            const allSales = await Sale.find({ productId: product._id }).sort({ date: 1 });

            // Group by region
            const salesByRegion = {};
            allSales.forEach(sale => {
                const r = sale.region || 'Global';
                if (!salesByRegion[r]) salesByRegion[r] = [];
                salesByRegion[r].push(sale);
            });

            // Generate forecast for each region
            for (const region of Object.keys(salesByRegion)) {
                const regionalSales = salesByRegion[region];

                console.log(`Product: ${product.name}, Region: ${region}, Records: ${regionalSales.length}`);

                if (regionalSales.length < 2) {
                    console.log('Skipping: Not enough data (needs 2).');
                    continue;
                }

                console.log('Calling AI Service...');
                const prediction = await aiService.predictDemand(product, regionalSales, region);
                console.log('AI Prediction Result:', prediction);

                if (prediction) {
                    const forecast = new Forecast({
                        productId: product._id,
                        region: region,
                        forecastMonth: prediction.month,
                        predictedDemand: prediction.demand,
                        confidenceScore: prediction.confidence,
                        aiReasoning: prediction.reasoning
                    });
                    await forecast.save();
                    forecasts.push(forecast);
                } else {
                    console.error('AI Service returned null.');
                }
            }
        }

        res.json({ message: 'Forecast generated', forecasts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating forecast');
    }
};

exports.getForecasts = async (req, res) => {
    try {
        const forecasts = await Forecast.find().populate('productId').sort({ createdAt: -1 });
        res.json(forecasts);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

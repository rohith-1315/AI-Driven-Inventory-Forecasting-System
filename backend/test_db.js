const mongoose = require('mongoose');

// Try different connection strings
const uris = [
    'mongodb://127.0.0.1:27017/inventory_forecast',
    'mongodb://localhost:27017/inventory_forecast',
    'mongodb://0.0.0.0:27017/inventory_forecast'
];

async function testConnection() {
    for (const uri of uris) {
        console.log(`Trying to connect to: ${uri}`);
        try {
            await mongoose.disconnect();
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log(`SUCCESS: Connected to ${uri}`);

            // Try to create a dummy document to ensure write access
            const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
            await new Test({ name: 'Connection Check' }).save();
            console.log('SUCCESS: Wrote document to database.');

            process.exit(0);
        } catch (error) {
            console.error(`FAILED: ${error.message}`);
        }
    }
    console.error('All connection attempts failed.');
    process.exit(1);
}

testConnection();

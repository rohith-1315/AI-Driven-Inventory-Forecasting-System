const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controller = require('../controllers/inventoryController');

router.post('/upload', upload.single('file'), controller.uploadSales);
router.get('/products', controller.getProducts);
router.get('/sales', controller.getSales);
router.post('/forecast', controller.generateForecast);
router.get('/forecasts', controller.getForecasts);

module.exports = router;

// routes/predictionRoutes.js

const express = require('express');
const router = express.Router();
const { getPredictions, createPrediction } = require('../controllers/predictionController');

// GET /api/predictions - Fetch all predictions
router.get('/', getPredictions);


module.exports = router;

// models/Prediction.js

const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  predictedDisease: { type: String, required: true },
  predictionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', PredictionSchema);

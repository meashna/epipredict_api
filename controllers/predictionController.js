const Prediction = require('../models/Prediction');
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const Patient = require('../models/Patient');

/**
 * Fetch all predictions with populated related fields.
 */
const getPredictions = async (req, res) => {
  try {
    console.log('Fetching predictions from the database...');

    const predictions = await Prediction.find()
      .populate('doctorId', 'username')
      .populate('patientId', 'patientName')
      .populate('consultationId');

    console.log('Predictions fetched successfully:', predictions);

    res.status(200).json({
      message: 'Predictions fetched successfully',
      predictions,
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);

    res.status(500).json({
      message: 'Server error while fetching predictions',
      error: error.message, // Include the error message for easier debugging
    });
  }
};

module.exports = {
  getPredictions,
};

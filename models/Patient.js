const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the doctor (User)
  patientName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, required: true },
  height: { type: Number, required: true }, // Height in cm or inches
  weight: { type: Number, required: true }, // Weight in kg or lbs
  contactInfo: { type: String }, // Optional
  createdAt: { type: Date, default: Date.now },

  // Array of references to consultationsss
  consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }] // Array of Consultation ObjectIds
});

module.exports = mongoose.model('Patient', PatientSchema);

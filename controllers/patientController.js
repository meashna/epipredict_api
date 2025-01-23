const Patient = require('../models/Patient');
const User = require('../models/User');

// Register a new patient
exports.registerPatient = async (req, res) => {
  const { doctorId, patientName, gender, age, height, weight, contactInfo } = req.body;

  try {
    const patient = new Patient({
      doctorId,
      patientName,
      gender,
      age,
      height,
      weight,
      contactInfo
    });
    
    // Save the new patient to the database
    const savedPatient = await patient.save();

    // Now update the doctor's (user's) patients array
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    doctor.patients.push(savedPatient._id); // Add the patient's ObjectId to the doctor
    await doctor.save(); // Save the updated doctor document

    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (err) {
    res.status(500).json({ error: 'Error registering patient',details: err.message });
  }
};

// Get patient data by ID
exports.getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id).populate('doctorId', 'username');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving patient data' });
  }
};

// Get all patients (without filtering by doctor)
// Get all patients (without filtering by doctor)
// exports.getAllPatients = async (req, res) => {
//   try {
//     const patients = await Patient.find();  // Fetch all patients
//     console.log(patients);  // Log the result for debugging
//     res.status(200).json(patients);  // Send patients as JSON response
//   } catch (err) {
//     console.error('Errors fetching patients:', err);  // Log the full error
//     res.status(500).json({ error: 'Errors retrieving patients', details: err.message });  // Send detailed error message
//   }
// };
exports.getAllPatients = async (req, res) => {
  try {
    // Sort by createdAt in descending order so newest records come first
    const patients = await Patient.find().sort({ createdAt: -1 });

    console.log(patients);
    res.status(200).json(patients);
  } catch (err) {
    console.error('Errors fetching patients:', err);
    res.status(500).json({
      error: 'Errors retrieving patients',
      details: err.message,
    });
  }
};


//get consulation by patient id 
exports.getPatientConsulations = async (req, res) => {
  try {
    const patientId = req.params.id;
    // Populate consultations with full consultation data
    const patient = await Patient.findById(patientId).populate('consultations');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient.consultations);  // Return consultations
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving patient consultations', details: err.message });
  }
};

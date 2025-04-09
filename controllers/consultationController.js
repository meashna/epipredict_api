// controllers/consultationController.js

const mongoose = require("mongoose");
const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");
const Symptom = require("../models/Symptom");
const User = require("../models/User");
const axios = require("axios");
const Prediction = require("../models/Prediction"); // Import Prediction model

// Define a mapping from lowercase, space-separated symptom names to schema field names
const symptomNameMapping = {
  "high fever": "High_Fever",
  "severe headache": "Severe_Headache",
  "pain behind the eyes": "Pain_Behind_Eyes",
  "muscle and joint pain": "Muscle_and_Joint_Pain",
  "skin rash": "Skin_Rash",
  "nausea and vomiting": "Nausea_and_Vomiting",
  fatigue: "Fatigue",
  "mild bleeding": "Mild_Bleeding",
  "abdominal pain": "Abdominal_Pain",
  "redness in palms and soles": "Redness_in_Palms_and_Soles",
  "cyclical fever with chills and sweating":
    "Cyclical_Fever_with_Chills_and_Sweating",
  "muscle pain": "Muscle_Pain",
  diarrhea: "Diarrhea",
  jaundice: "Jaundice",
  "confusion or altered mental state": "Confusion_or_Altered_Mental_State",
  "sudden onset of fever": "Sudden_Onset_of_Fever",
  "debilitating joint pain": "Debilitating_Joint_Pain",
  rash: "Rash",
  "mild headache": "Mild_Headache",
  nausea: "Nausea",
  "swelling in joints": "Swelling_in_Joints",
  "muscle tenderness": "Muscle_Tenderness",
  eschar: "Eschar",
  chills: "Chills",
  "lymph node swelling": "Lymph_Node_Swelling",
  "dry cough": "Dry_Cough",
  "hearing loss": "Hearing_Loss",
  "stiff neck": "Stiff_Neck",
  seizures: "Seizures",
  "altered mental status": "Altered_Mental_Status",
  vomiting: "Vomiting",
  tremors: "Tremors",
  "paralysis or muscle weakness": "Paralysis_or_Muscle_Weakness",
  "speech difficulties": "Speech_Difficulties",
  "sensitivity to light": "Sensitivity_to_Light",
  "sudden fever": "Sudden_Fever",
  convulsions: "Convulsions",
  confusion: "Confusion",
  coma: "Coma",
  "muscle weakness": "Muscle_Weakness",
  "difficulty swallowing": "Difficulty_Swallowing",
  hallucinations: "Hallucinations",
  "loss of appetite": "Loss_of_Appetite",
  "respiratory distress": "Respiratory_Distress",
  fever: "Fever",
  "neurological symptoms": "Neurological_Symptoms",
  "swollen lymph nodes": "Swollen_Lymph_Nodes",
  "eye pain": "Eye_Pain",
  "joint stiffness": "Joint_Stiffness",
  "high fever with chills": "High_Fever_with_Chills",
  "bleeding tendencies": "Bleeding_Tendencies",
  "pain in the abdomen": "Pain_in_the_Abdomen",
  "low blood pressure": "Low_Blood_Pressure",
  "back pain": "Back_Pain",
  "brain inflammation": "Brain_Inflammation",
  drowsiness: "Drowsiness",
  "muscle aches": "Muscle_Aches",
  "double vision": "Double_Vision",
  "weakness or paralysis": "Weakness_or_Paralysis",
  "rapid breathing": "Rapid_Breathing",
  "persistent cough": "Persistent_Cough",
  "sore throat": "Sore_Throat",
  "body aches": "Body_Aches",
  "runny or congested nose": "Runny_or_Stuffy_Nose",
  "shortness of breath": "Shortness_of_Breath",
  "chest pain": "Chest_Pain",
  "puffy cheeks": "Puffy_Cheeks",
  "swollen jaw": "Swollen_Jaw",
  "pain while chewing or swallowing": "Pain_while_Chewing_or_Swallowing",
  headache: "Headache",
  "swelling in other glands": "Swelling_in_Other_Glands",
};

// Utility function to map symptoms array to SymptomSchema fields
const mapSymptomsToFields = (symptoms) => {
  // Initialize all symptom fields to 0
  const symptomData = {};
  Object.values(symptomNameMapping).forEach((field) => {
    symptomData[field] = 0;
  });

  // Set active symptoms to 1
  symptoms.forEach((symptom) => {
    if (typeof symptom !== "string") {
      console.warn(`Invalid symptom type: ${symptom}. Expected a string.`);
      return;
    }

    const key = symptom.toLowerCase().trim();
    const mappedField = symptomNameMapping[key];
    if (mappedField) {
      symptomData[mappedField] = 1;
    } else {
      console.warn(`Symptom "${symptom}" does not match any schema fields.`);
      // Optionally, handle unknown symptoms here (e.g., add dynamically or return an error)
    }
  });

  return symptomData;
};

// Controller to create a new consultation
// exports.createConsultation = async (req, res) => {
//   const { patientId, doctorId, symptoms, diagnosis, prescription } = req.body;

//   try {
//     // **Step 1:** Validate `patientId` and `doctorId`
//     const [patient, doctor] = await Promise.all([
//       Patient.findById(patientId),
//       User.findById(doctorId),
//     ]);

//     if (!patient) {
//       return res.status(404).json({ error: 'Patient not found' });
//     }

//     if (!doctor) {
//       return res.status(404).json({ error: 'Doctor not found' });
//     }

//     // **Step 2:** Process symptoms
//     const symptomData = mapSymptomsToFields(symptoms);

//     // **Step 3:** Create and save the Symptom document
//     const symptom = new Symptom(symptomData);
//     await symptom.save();

//     // **Step 4:** Send symptoms to FastAPI for disease prediction
//     const fastApiUrl = 'http://localhost:8000/predict'; // Adjust if FastAPI is hosted elsewhere

//     // Prepare the data in the format expected by FastAPI
//     const symptomPayload = symptomData;

//     // **Ensure that symptomPayload has all the required fields**
//     // You might need to verify this based on your SymptomData model

//     let predictedDisease = "Unknown Disease";

//     try {
//       const response = await axios.post(fastApiUrl, symptomPayload, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         timeout: 5000, // Optional: Set a timeout for the request
//       });

//       predictedDisease = response.data.disease;
//       console.log(`Predicted Disease: ${predictedDisease}`);
//     } catch (apiError) {
//       console.error('Error communicating with FastAPI:', apiError.response ? apiError.response.data : apiError.message);
//       // Optionally, handle the error, e.g., set predictedDisease to a default value or abort
//       // For example:
//       // return res.status(500).json({ error: 'Failed to get prediction from FastAPI', details: apiError.message });
//     }

//     // **Step 5:** Create the Consultation document with reference to Symptom
//     const consultation = new Consultation({
//       patientId,
//       doctorId,
//       symptoms: symptom._id, // Reference to the Symptom document
//       diagnosis,
//       prescription,
//       consultationDate: new Date(),
//     });

//     await consultation.save();

//     // **Step 6:** Update the Patient document with the new Consultation
//     patient.consultations.push(consultation._id);
//     await patient.save();

//     // **Step 7:** Save the Prediction in the database
//     const prediction = new Prediction({
//       patientId,
//       doctorId,
//       consultationId: consultation._id,
//       predictedDisease,
//     });

//     await prediction.save();

//     res.status(201).json({
//       message: 'Consultation created and disease predicted successfully',
//       consultation: {
//         _id: consultation._id,
//         patientId: consultation.patientId,
//         doctorId: consultation.doctorId,
//         symptoms: consultation.symptoms,
//         diagnosis: consultation.diagnosis,
//         prescription: consultation.prescription,
//         consultationDate: consultation.consultationDate,
//         createdAt: consultation.createdAt,
//         updatedAt: consultation.updatedAt,
//       },
//       prediction: {
//         _id: prediction._id,
//         patientId: prediction.patientId,
//         doctorId: prediction.doctorId,
//         consultationId: prediction.consultationId,
//         predictedDisease: prediction.predictedDisease,
//         predictionDate: prediction.predictionDate,
//         createdAt: prediction.createdAt,
//         updatedAt: prediction.updatedAt,
//       },
//     });
//   } catch (err) {
//     console.error('Error creating consultation:', err);
//     res.status(500).json({ error: 'Internal server error', details: err.message });
//   }
// };

exports.createConsultation = async (req, res) => {
  const { patientId, doctorId, symptoms, diagnosis, prescription } = req.body;

  try {
    // **Step 1:** Validate patientId and doctorId
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      User.findById(doctorId),
    ]);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // **Step 2:** Process symptoms
    const symptomData = mapSymptomsToFields(symptoms);

    // **Step 3:** Create and save the Symptom document
    const symptom = new Symptom(symptomData);
    await symptom.save();

    // **Step 4:** Create and save the Consultation document
    const consultation = new Consultation({
      patientId,
      doctorId,
      symptoms: symptom._id, // Reference to the Symptom document
      diagnosis,
      prescription,
      consultationDate: new Date(),
    });

    await consultation.save();

    // **Step 5:** Update the Patient document with the new Consultation
    patient.consultations.push(consultation._id);
    await patient.save();

    // **Step 6:** Send symptoms to FastAPI for disease prediction
    const fastApiUrl =
      process.env.FASTAPI_URL || "http://localhost:8000/predict"; // Use environment variable

    const symptomPayload = symptomData;

    let predictedDisease = "Unknown Disease";

    try {
      const response = await axios.post(fastApiUrl, symptomPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });

      predictedDisease = response.data.disease;
      console.log(`Predicted Disease: ${predictedDisease}`);
    } catch (apiError) {
      console.error(
        "Error communicating with FastAPI:",
        apiError.response ? apiError.response.data : apiError.message
      );
      // Optionally, handle the error appropriately
      return res
        .status(502)
        .json({ error: "Failed to get prediction from prediction service" });
    }

    // **Step 7:** Create and save the Prediction document
    const prediction = new Prediction({
      patientId,
      doctorId,
      consultationId: consultation._id,
      predictedDisease,
    });

    await prediction.save();

    // **Step 8:** Populate the consultation and prediction fields
    const populatedConsultation = await Consultation.findById(consultation._id)
      .populate("patientId", "patientName")
      .populate("doctorId", "username")
      .populate("symptoms"); // Populate the symptoms field

    const populatedPrediction = await Prediction.findById(prediction._id)
      .populate("patientId", "patientName")
      .populate("doctorId", "username")
      .populate("consultationId");

    // **Step 9:** Extract active symptoms from the Symptom document
    const activeSymptoms = Object.keys(
      populatedConsultation.symptoms.toObject()
    ).filter((key) => populatedConsultation.symptoms[key] === 1);

    // **Step 10:** Prepare the response
    res.status(201).json({
      message: "Consultation created and disease predicted successfully",
      consultation: {
        _id: populatedConsultation._id,
        patientId: populatedConsultation.patientId,
        doctorId: populatedConsultation.doctorId,
        symptoms: activeSymptoms, // List of symptom names
        diagnosis: populatedConsultation.diagnosis,
        prescription: populatedConsultation.prescription,
        consultationDate: populatedConsultation.consultationDate,
        createdAt: populatedConsultation.createdAt,
        updatedAt: populatedConsultation.updatedAt,
      },
      prediction: {
        _id: populatedPrediction._id,
        patientId: populatedPrediction.patientId,
        doctorId: populatedPrediction.doctorId,
        consultationId: populatedPrediction.consultationId,
        predictedDisease: populatedPrediction.predictedDisease,
        predictionDate: populatedPrediction.predictionDate,
        createdAt: populatedPrediction.createdAt,
        updatedAt: populatedPrediction.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error creating consultation:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

// Get consultation data by ID
exports.getConsultationById = async (req, res) => {
  const { id } = req.params;

  try {
    const consultation = await Consultation.findById(id)
      .populate("patientId", "patientName")
      .populate("doctorId", "username");
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving consultation data" });
  }
};

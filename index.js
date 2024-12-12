const express = require('express');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const connectDB = require('./config/db');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());  

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes here
app.use('/', authRoutes);  // Use the auth routes for handling requests
app.use('/patients', patientRoutes);
app.use('/consultations', consultationRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

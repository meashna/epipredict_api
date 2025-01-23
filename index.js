// const express = require('express');
// const authRoutes = require('./routes/authRoutes');
// const patientRoutes = require('./routes/patientRoutes');
// const consultationRoutes = require('./routes/consultationRoutes');
// const connectDB = require('./config/db');
// require('dotenv').config();  // Load environment variables from .env file
// const predictionRoutes = require('./routes/predictionRoutes');
// const { Server } = require('socket.io');
// const app = express();

// // Connect to the database
// connectDB();

// // Middleware to parse JSON request bodies
// app.use(express.json());  

// // Root route
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// // Routes here
// app.use('/', authRoutes);  // Use the auth routes for handling requests
// app.use('/patients', patientRoutes);
// app.use('/consultations', consultationRoutes);
// app.use('/api/predictions', predictionRoutes);

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;app.use('/api/predictions', predictionRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
// index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const connectDB = require('./config/db');
require('dotenv').config();  // Load environment variables from .env file

// Initialize Express
const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/', authRoutes);            // Authentication routes
app.use('/patients', patientRoutes); // Patient-related routes
app.use('/consultations', consultationRoutes); // Consultation-related routes
app.use('/api/predictions', predictionRoutes);  // Prediction-related routes

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Replace '*' with your frontend URL for security, e.g., 'http://localhost:3000'
    methods: ['GET', 'POST'],
  },
});



// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export both app and io for use in other modules
module.exports = { app, io };

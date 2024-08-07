const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const path = require('path');
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const commentRoutes = require('./routes/comment');
require('dotenv').config();

const app = express();

// Set security headers
app.use(helmet());

// Enable CORS with specific origin and credentials
const corsOptions = {
  origin: '*', // Your frontend URL
  credentials: true, // Allow credentials to be sent
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Body parser to handle JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "images" directory with appropriate headers
app.use('/images', express.static(path.join(__dirname, 'images'), {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow resources to be accessed from different origins
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Mitigate side-channel attacks
  }
}));

// Protection against XSS attacks
app.use(xss());

// Prevent DOS attacks by limiting request body size
app.use(express.json({ limit: '10kb' }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/messages', commentRoutes);

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

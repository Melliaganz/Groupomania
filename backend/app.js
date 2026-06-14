const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require('path');
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const commentRoutes = require('./routes/comment');
require('dotenv').config({ quiet: true });

const app = express();

// Set security headers
app.use(helmet());

// Enable CORS. Whitelist du front via la variable d'env CORS_ORIGIN
// (plusieurs origines separees par des virgules). Defaut : tout autoriser.
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions)); // gere aussi les requetes preflight OPTIONS

// Body parsers (integres a Express) avec limite de taille pour limiter les abus
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

// Serve static files from the "images" directory with appropriate headers
app.use('/images', express.static(path.join(__dirname, 'images'), {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow resources to be accessed from different origins
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Mitigate side-channel attacks
  }
}));

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

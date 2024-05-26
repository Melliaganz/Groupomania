const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const commentRoutes = require('./routes/comment');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const session = require('express-session');

const app = express();

// Set security headers
app.use(helmet());

// Enable CORS with specific origin and credentials
const corsOptions = {
  origin: 'https://groupomania-eta.vercel.app', // Your frontend URL
  credentials: true, // Allow credentials to be sent
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(session({
  secret: 'RANDOM_TOKEN_SECRET', // Remplacez par votre clé secrète
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Utilisez secure seulement en production
    sameSite: 'None', // Utilisation de SameSite=None pour permettre les contextes intersites
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
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

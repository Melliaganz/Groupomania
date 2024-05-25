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

const app = express();

// Set security headers
app.use(helmet());

// Enable CORS with specific origin and credentials
const corsOptions = {
  origin: 'https://groupomania-eta.vercel.app',
  credentials: true, // Allow credentials to be sent
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));

// Custom headers for preflight requests
app.options('*', cors(corsOptions));

app.use(cookieParser());
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

module.exports = app;

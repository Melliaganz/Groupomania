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

app.use(helmet());
app.use(cors({ origin: 'https://groupomania-eta.vercel.app', credentials: true }));
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(xss());
app.use(express.json({ limit: '10kb' }));

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const commentRoutes = require('./routes/comment');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');




const app = express();

app.use(helmet());
app.use(cors({origin: "http://localhost:3001", credentials: true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(xss());
// Prevent DOS attacks
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb




app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/comment', commentRoutes)
//app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

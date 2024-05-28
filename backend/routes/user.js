const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const userCtrl = require("../controllers/user");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 50, // start blocking after 50 requests
  message: "Too many accounts created from this IP, please try again after an hour",
});

router.post("/signup", createAccountLimiter, userCtrl.signup);
router.post("/login", apiLimiter, userCtrl.login);
router.post("/logout", userCtrl.logout);

router.get("/account/:id", auth, userCtrl.getUserProfile); // Removed multer from GET request
router.put("/account/:id", auth, multer, userCtrl.updateUserProfile);
router.delete("/account/:id", auth, userCtrl.deleteUserProfile);

module.exports = router;

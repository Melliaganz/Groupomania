const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const messageCtrl = require("../controllers/message");

router.get("/", auth, messageCtrl.getAllMessages);
router.get("/userMessages/:id", auth, messageCtrl.getUserAllMessages);
router.post("/new", auth, multer, messageCtrl.createMessage);
router.get("/:id", auth, messageCtrl.getOneMessage);
router.delete('/:id',auth, messageCtrl.deleteMessage);


module.exports = router;
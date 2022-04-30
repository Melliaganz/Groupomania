const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const commentCtrl = require('../controllers/comment')

router.post('/messages/:id', auth, commentCtrl.createComment)


module.exports = router
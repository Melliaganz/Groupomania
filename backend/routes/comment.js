const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const commentCtrl = require('../controllers/comment')

router.post('/:id/comment', auth, commentCtrl.createComment)
router.get('/:id/comments', auth, commentCtrl.getMessageAllComments)
router.get("/:id/comment/:id", auth, commentCtrl.getOneComment)
router.delete('/:id/comment/:id', auth, commentCtrl.deleteComments)

module.exports = router
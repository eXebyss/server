const Router = require('express')
const messageController = require('../controller/messageController')

const router = new Router()

router.post('/new-message', messageController.createMessage)
router.get('/get-messages', messageController.getMessages)

module.exports = router

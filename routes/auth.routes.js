const Router = require('express')
const authController = require('../controller/authController')
const authMiddleware = require('../middleware/auth.middleware')

const router = new Router()

router.post('/registration', authController.credentialsCheck, authController.registration)

router.post('/login', authController.login)

router.get('/auth', authMiddleware, authController.auth)

module.exports = router

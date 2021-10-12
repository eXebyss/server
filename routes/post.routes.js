const Router = require('express')
const postController = require('../controller/postsController')

const router = new Router()

router.post('/create', postController.createPost)
router.get('/getall', postController.getPosts)

module.exports = router

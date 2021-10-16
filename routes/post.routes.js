const Router = require('express')
const postController = require('../controller/postsController')

const router = new Router()

router.post('/create-post', postController.createPost)
router.get('/get-posts', postController.getPosts)

module.exports = router

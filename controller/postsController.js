const Post = require('../models/Post')

class PostController {
    createPost = async (req, res) => {
        try {
            const { content, date } = req.body
            const post = new Post({ content, date })
            await post.save()
            console.log('Post has been created successfully!')
            res.status(201).json({ message: 'Post has been created successfully!' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Ooopps... Something went wrong... 1' })
        }
    }

    getPosts = async (req, res) => {
        try {
            const posts = await Post.find()
            res.status(200).json(posts)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Ooopps... Something went wrong... 2' })
        }
    }

}

module.exports = new PostController()


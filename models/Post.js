const { Schema, model } = require('mongoose')

const Post = new Schema({
	content: { type: String, required: true },
	date: { type: Date, default: Date.now() },
})

module.exports = model('Post', Post)

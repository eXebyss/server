const { Schema, model } = require('mongoose')

const Message = new Schema({
	nickname: { type: String, required: true },
	content: { type: String, required: true },
	date: { type: Date, default: Date.now() },
})

module.exports = model('Message', Message)

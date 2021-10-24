const Message = require('../models/Message')
const events = require('events')

const emitter = new events.EventEmitter()

class MessageController {
	createMessage = async (req, res) => {
		try {
			const { nickname, content, date } = req.body
			const message = new Message({ nickname, content, date })
			await message.save()
			emitter.emit('newMessage', message)
			console.log('Post has been created successfully!')
			res.status(201).json({ message: 'Post has been created successfully!' })
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 1' })
		}
	}

	getMessages = async (req, res) => {
		try {
			const messages = await Message.find()
			res.status(200).json(messages)
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 2' })
		}
	}

	getMessagesLongPolling = async (req, res) => {
		try {
			emitter.once('newMessage', async messages => {
				messages = await Message.find()
				res.status(200).json(messages)
			})
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 3' })
		}
	}
}

module.exports = new MessageController()

const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const messageRouter = require('./routes/message.routes')
const cors = require('cors')

const PORT = process.env.PORT || config.get('serverPort')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)

const start = async () => {
	try {
		await mongoose.connect(process.env.dbUrl || config.get('dbUrl'))

		app.listen(PORT, () => {
			console.log('Server listening on port: ', PORT)
		})
	} catch (err) {
		console.log(err)
	}
}

start()

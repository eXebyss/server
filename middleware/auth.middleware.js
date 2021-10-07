const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'Auth error 1' })
		}
		const decoded = jwt.verify(token, config.get('secretKey'))
		req.user = decoded
		next()
	} catch (error) {
		res.status(401).json({ message: 'Auth error 2' })
	}
}

const Router = require('express')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const authMiddle = require('../middleware/auth.middleware')
const authMiddleware = require('../middleware/auth.middleware')

const router = new Router()

router.post(
	'/registration',
	[
		check('email', 'Incorrect email').isEmail(),
		check(
			'password',
			'Password must be at least 3 characters and shorter than 16!'
		).isLength({ min: 3, max: 16 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Incorrect request', errors })
			}
			const { email, password } = req.body
			const candidate = await User.findOne({ email })
			if (candidate) {
				return res
					.status(400)
					.json({ message: `User with email ${email} already exists` })
			}
			const hasPassword = await bcrypt.hash(password, 8)
			const user = new User({ email, password: hasPassword })
			await user.save()
			res.status(201).json({ message: 'User was successfully registered' })
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Server error 1' })
		}
	}
)

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		const isPassValid = bcrypt.compareSync(password, user.password)
		if (!isPassValid) {
			return res.status(400).json({ message: 'Invalid password' })
		}
		const token = jwt.sign({ id: user.id }, config.get('secretKey'), {
			expiresIn: '1h',
		})
		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
			},
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Server error 2' })
	}
})

router.get('/auth', authMiddleware, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id })
		const token = jwt.sign({ id: user.id }, config.get('secretKey'), {
			expiresIn: '1h',
		})
		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
			},
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Server error 3' })
	}
})

module.exports = router
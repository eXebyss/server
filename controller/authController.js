const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')

class AuthController {
	registration = () => {
		;[
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
						return res
							.status(400)
							.json({ message: 'Incorrect request', errors })
					}
					const { email, nickname, password } = req.body
					const candidate = await User.findOne({ email })
					if (candidate) {
						return res
							.status(400)
							.json({ message: `User with email ${email} already exists` })
					}
					const hasPassword = await bcrypt.hash(password, 8)
					const user = new User({ email, nickname, password: hasPassword })
					await user.save()
					res.status(201).json({ message: 'User was successfully registered' })
				} catch (err) {
					console.log(err)
					res.status(500).json({ message: 'Server error 1' })
				}
			}
	}

	login = async (req, res) => {
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
					nickname: user.nickname,
				},
			})
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Server error 2' })
		}
	}

	auth = async (req, res) => {
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
					nickname: user.nickname,
				},
			})
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Server error 3' })
		}
	}
}

module.exports = new AuthController()

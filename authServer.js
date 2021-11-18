require('dotenv').config()
require('os')
const express = require('express')
const jwt = require('jsonwebtoken')
const os = require('os')
const verifyToken = require('./middleware/auth')

const app = express()
app.use(express.json())

// database
let users = [
	{
		id: 1,
		username: 'henry',
		password:'123',
		refreshToken: null
	},
	{
		id: 2,
		username: 'jim',
		password:'123',
		refreshToken: null
	}
]

// app

const generateTokens = payload => {
	const { id, username } = payload
	console.log('users')
	// Create JWT
	const accessToken = jwt.sign(
		{ id, username },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: '50m'
		}
	)

	const refreshToken = jwt.sign(
		{ id, username },
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: '1h'
		}
	)

	return { accessToken,refreshToken }
}

const updateRefreshToken = (username, refreshToken) => {
	users = users.map(user => {
		if (user.username === username)
			return {
				...user,
				refreshToken
			}

		return user
	})
}
app.post('/demo', (req, res) => {
	const id = 'id'
	const accessToken = jwt.sign(
		{ id },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: '20s'
		}
	)
	console.log(req.body.username)
	res.json(accessToken)
})
app.post('/check', (req, res) => {
	const tocKen = req.body.tocKen
	try {
		jwt.verify(tocKen, process.env.ACCESS_TOKEN_SECRET)

		res.json('success')
	} catch (error) {
		res.sendStatus(error)
		console.log(error)
	}

	res.json(accessToken)
})

app.post('/login', (req, res) => {
	const username = req.body.username
	const user = users.find((user) => {user.username === username})

	if (!user) return res.sendStatus(401)

	const tokens = generateTokens(user)
	updateRefreshToken(username, tokens.refreshToken)

	console.log(username)

	res.json(tokens)
})

app.post('/token', (req, res) => {
	const refreshToken = req.body.refreshToken
	if (!refreshToken) return res.sendStatus(401)

	const user = users.find(user => user.refreshToken === refreshToken)
	if (!user) return res.sendStatus(403)

	try {
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

		const tokens = generateTokens(user)
		updateRefreshToken(user.username, tokens.refreshToken)

		res.json(tokens)
	} catch (error) {
		console.log(error)
		res.sendStatus(403)
	}
})

app.delete('/logout', verifyToken, (req, res) => {
	const user = users.find(user => user.id === req.userId)
	updateRefreshToken(user.username, null)

	res.sendStatus(204)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

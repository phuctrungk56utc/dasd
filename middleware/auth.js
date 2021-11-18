const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	
	const token = authHeader && authHeader.split(' ')[1]

	
	if (!token) return res.sendStatus(401)

	try {
		// const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

		const basicauth = Buffer.from(token, 'base64').toString('ascii')
		// console.log(Buffer.from(token, 'base64').toString('ascii'));
		// console.log(basicauth.split(':')[0])
		// console.log(basicauth.split(':')[1])
		// console.log(decoded)
		if(basicauth.split(':')[0] !== 'trungtp' || basicauth.split(':')[1] !== '1234'){ throw 'myException'}

		// req.userId = decoded.id
		next()
	} catch (error) {
		console.log('error')
		return res.sendStatus(403)
	}
}

module.exports = verifyToken

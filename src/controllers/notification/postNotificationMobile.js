// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
const crypt = require("../../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
const decodeJWT = require('jwt-decode');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let postNotificationMobile = async (req, res) => {

	try {
		var userId = '';
		try {
			const token = req.headers.authorization.split(' ')[1];
			const basicAuth = Buffer.from(token, 'base64').toString('ascii');
			userId = basicAuth.split(':')[0].toUpperCase();
		} catch (error) {
			const accessToken = crypt.decrypt(req.headers.authorization);
			const decodeTk = decodeJWT(accessToken);
			userId = decodeTk.userId.toUpperCase();
		}
        
		const query = `INSERT INTO prm."NotificationMobileKey" ("userId","Token")  
		select 
		unnest(array['${userId}']::character varying[]) as "userId",
		unnest(array['${req.body.params.token}']::text[]) as "Token"
		ON CONFLICT ("Token") DO UPDATE 
		  SET 
		  "Token" = EXCLUDED."Token",
			"userId" = EXCLUDED."userId";`
		//WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`
		db.query(query, (err, resp) => {
			if (err) {
				return res.status(404).json({ message: err.message });
			} else {
				return res.status(200).json( resp.rows );
			}
		})
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}

}
module.exports = {
	postNotificationMobile: postNotificationMobile,
}

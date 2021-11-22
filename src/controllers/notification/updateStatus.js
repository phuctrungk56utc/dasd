// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let updateStatus = async (req, res) => {
	try {
			query = `UPDATE prm."Notification"
            SET "StatusCode"='X', "StatusDescription"='Đã đọc'
            WHERE id=${req.body.params.id};`
		//WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`
		db.query(query, (err, resp) => {
			if (err) {
				return res.status(404).json({ message: err.message });
			} else {
				return res.status(200).json( resp.rows );
			}
		})
	} catch (error) {
        return res.status(404).json({ message: err.message });
	}

}
module.exports = {
	updateStatus: updateStatus,
}

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
let getListRelease = async (req, res) => {

	try {
		var query = `select "Release_ID" from prm."${req.query.type}"`;
		// query = `${req.query.query}`;
		db.query(query, (err, resp) => {
			if (err) {
				return res.status(404).json({ message: err.message });
			} else {
				return res.status(200).json( resp.rows );
			}
		})
	} catch (error) {
		console.log(error)
	}

}
module.exports = {
	getListRelease: getListRelease,
}

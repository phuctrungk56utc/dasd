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
let releaseCondition = async (req, res) => {

	try {
		Object.size = function (obj) {
			var size = 0,
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};

		// Get the size of an object
		var size = Object.size(req.query);
		var query;
		if (size > 0) {
			query = `SELECT * FROM prm."${req.query.releaseType}"
        WHERE "${Object.keys(req.query)[0]}"=${String(req.query[Object.keys(req.query)[0]])}`
		} else {
			query = `SELECT * FROM prm."${req.query.releaseType}"`
		}
		query = `${req.query.query}`;
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
	releaseCondition: releaseCondition,
}

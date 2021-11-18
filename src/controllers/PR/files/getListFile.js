// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let getListFile = async (req, res) => {
	try {
		var query = `SELECT * FROM prm."FileUpload" WHERE "PR_NO"=${req.query.PR_NO} ;`
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
	getListFile: getListFile,
}

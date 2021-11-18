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
let deletePr = async (req, res) => {
	try {
		await db.query(`DELETE FROM prm."PrTable"
        WHERE "PR_NO" = ${req.body.params.PR_NO};`)
        await db.query(`DELETE FROM prm."PrItem"
        WHERE "PR_NO" = ${req.body.params.PR_NO};`)
	} catch (error) {

	}

}
module.exports = {
	deletePr: deletePr,
}

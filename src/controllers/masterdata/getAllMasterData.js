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
let getAllMasterData = async (req, res) => {
	try {

		Object.size = function (obj) {
			var size = 0,
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};
		var size = Object.size(req.query);
		var query;
		if (String(req.query[Object.keys(req.query)[0]]) === '*') {
			query = `SELECT * FROM prm.${Object.keys(req.query)[0]};`
		} else {
			if(String(req.query[Object.keys(req.query)[0]]).length === 1){
			query = `SELECT * FROM prm.${Object.keys(req.query)[0]}
			WHERE ${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]]).toLowerCase()}%' OR 
			${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]]).toUpperCase()}%' OR
			"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]]).toLowerCase()}%' OR 
			"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]]).toUpperCase()}%';`
			}else{
				query = `SELECT * FROM prm.${Object.keys(req.query)[0]}
				WHERE ${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]])}%' OR
				"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]])}%';`
			}
		}
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
	getAllMasterData: getAllMasterData,
}

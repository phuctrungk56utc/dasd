// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
var sleep = require('sleep');
const db = require("../../../db/db");
const apiSap = require("../../../apiSap/apiSap");
const axios = require('axios');
var sleep = require('sleep');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let getPricePrItem = async (req, res) => {
	await sleep.sleep(1);
	try {
		let api = await db.query(`select api from prm."API" WHERE "api_key"='getPrice'`);
		if (api.rows.length > 0) {
			var data = await apiSap.apiSap(api.rows[0].api,req.query.dataSelectItem,'GET');
			return res.status(200).json(data.data);
		}
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
}
module.exports = {
	getPricePrItem: getPricePrItem,
}

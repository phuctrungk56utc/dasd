// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
const crypt = require("../../crypt/crypt");
var sleep = require('sleep');
const db = require("../../db/db");
const decodeJWT = require('jwt-decode');
const axios = require('axios');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let getApproveDetail = async (req, res) => {
	try {
		Object.size = function (obj) {
			var size = 0,
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};
		//get user call
		var userId = '';
		try {
			const token = req.headers.authorization.split(' ')[1];
			const basicAuth = Buffer.from(token, 'base64').toString('ascii');
			userId = basicAuth.split(':')[0].toUpperCase();
		} catch (error) {
			const accessToken = crypt.decrypt(req.headers.authorization);
			const decodeTk = decodeJWT(accessToken);
			userId = decodeTk.userId;
		}
		// Get the size of an object
		var size = Object.size(req.query);
		var query;
		if (size > 0) {
			query = `SELECT * FROM prm."PR_RELEASE_STRATEGY" 
        WHERE "${Object.keys(req.query)[0]}"=${String(req.query[Object.keys(req.query)[0]])} ORDER BY "RELEASE_LEVEL" ASC ;`
		} else {
			query = `SELECT * FROM prm."PR_RELEASE_STRATEGY"  ORDER BY "RELEASE_LEVEL" ASC ;`
		}
		// get and check author for PR approve
		const author = await db.query(`select * from prm."PR_RELEASE_STRATEGY" WHERE
					 "PR_NO"=${String(req.query[Object.keys(req.query)[0]])}  ORDER BY "RELEASE_LEVEL" ASC ;`);
		// var RELEASE_LEVEL = 1;
		// for (let index in author.rows) {
		// 	if (author.rows[index].userId === String(userId).toUpperCase()) {
		// 		RELEASE_LEVEL = author.rows[index].RELEASE_LEVEL;
		// 	}
		// }
		var checkAuthorValue = false;
			for (let index in author.rows) {
				// if (RELEASE_LEVEL === 1 && author.rows[index].ACTION_CODE === 0) {
				// 	checkAuthorValue = true;
				// 	break;
				// }
				if(userId === author.rows[index].userId && author.rows[index].ACTION_CODE === 0){
					for (let j in author.rows) {
						if((author.rows[index].RELEASE_LEVEL === 1 && author.rows[index].ACTION_CODE === 0) || (author.rows[index].RELEASE_LEVEL > author.rows[j].RELEASE_LEVEL && author.rows[j].ACTION_CODE === 1)){
							checkAuthorValue = true;
							break;
						}
					}
				}
				// if (author.rows[index].RELEASE_LEVEL < RELEASE_LEVEL && author.rows[index].ACTION_CODE !== 1) {
				// 	checkAuthorValue = false;
				// 	break;
				// }
			}
		

		db.query(query, (err, resp) => {
			if (err) {
				return res.status(404).json({ message: err.message });
			} else {
				return res.status(200).json({ data: resp.rows, authApprove: checkAuthorValue });
			}
		})
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}

}
module.exports = {
	getApproveDetail: getApproveDetail,
}

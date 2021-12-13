// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
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
		const userConpany = await db. query(`SELECT "BUKRS" FROM prm."userCompany"
		where "userId"='${userId}'`);
		var listCompanyString = "[";
		lengthUserCompany = userConpany.rows.length;
		if(lengthUserCompany > 0){
			for(let index in userConpany.rows){
				var stringValueChiden = "";
				stringValueChiden = `'${userConpany.rows[index].BUKRS}'`;
				if (lengthUserCompany > Number(index) + 1) {
					stringValueChiden += ','
				}

				listCompanyString += stringValueChiden;
			}
			listCompanyString += "]"
		}else{
			listCompanyString = "['']";
		}
		if(Object.keys(req.query)[0] === '"WERKS"'){
			if (String(req.query[Object.keys(req.query)[0]]) === '*') {
				query = `SELECT * FROM prm.${Object.keys(req.query)[0]} WHERE "BUKRS" = ANY(ARRAY${listCompanyString});`
			} else {
				if(String(req.query[Object.keys(req.query)[0]]).length === 1){
				query = `SELECT * FROM prm.${Object.keys(req.query)[0]}
				WHERE ( ${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]]).toLowerCase()}%' OR 
				${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]]).toUpperCase()}%' OR
				"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]]).toLowerCase()}%' OR 
				"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]]).toUpperCase()}%' ) and "BUKRS" = ANY(ARRAY${listCompanyString});`
				}else{
					query = `SELECT * FROM prm.${Object.keys(req.query)[0]}
					WHERE ( ${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]])}%' OR
					"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]])}%' ) and "BUKRS" = ANY(ARRAY${listCompanyString});`
				}
			}
		}else{
			if (String(req.query[Object.keys(req.query)[0]]) === '*') {
				query = `SELECT * FROM prm.${Object.keys(req.query)[0]};`
			} else {
				if(String(req.query[Object.keys(req.query)[0]]).length === 1){
				query = `SELECT * FROM prm.${Object.keys(req.query)[0]}
				WHERE ( ${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]]).toLowerCase()}%' OR 
				${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]]).toUpperCase()}%' OR
				"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]]).toLowerCase()}%' OR 
				"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]]).toUpperCase()}%' );`
				}else{
					query = `SELECT * FROM prm.${Object.keys(req.query)[0]}
					WHERE ( ${Object.keys(req.query)[0]} LIKE '%${String(req.query[Object.keys(req.query)[0]])}%' OR
					"DESCRIPTION" LIKE '%${String(req.query[Object.keys(req.query)[0]])}%' );`
				}
			}
		}

		db.query(query, (err, resp) => {
			if (err) {
				return res.status(404).json({message: 'Syntax error'});
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

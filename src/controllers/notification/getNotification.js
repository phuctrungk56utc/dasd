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
let getNotification = async (req, res) => {

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
		var query = '';
		var now = new Date(`${req.query.yearQuery}`,`${req.query.monthQuery}`,'01');
		var prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
		var prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);
		
		var formatDateComponent = function(dateComponent) {
		  return (dateComponent < 10 ? '0' : '') + dateComponent;
		};
		
		var formatDate = function(date) {
		  return formatDateComponent(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()));
		};

		if(req.query && req.query.type){
			if(req.query.type !== 'All'){
				query = `SELECT * FROM prm."Notification" 
				WHERE "forUserId" = '${userId}' and "NotiType" = ${req.query.statusCode} and
				( "changeAt" BETWEEN '${formatDate(prevMonthFirstDate)} 00:00:00' AND '${formatDate(prevMonthLastDate)} 23:59:59' )
				ORDER BY "createAt" DESC;`
			}else{
				query = `SELECT * FROM prm."Notification"
				WHERE "forUserId" = '${userId}' and
				( "changeAt" BETWEEN '${formatDate(prevMonthFirstDate)} 00:00:00' AND '${formatDate(prevMonthLastDate)} 23:59:59' )
				 ORDER BY "createAt" DESC;`
			}
		}else{
			query = `SELECT * FROM prm."Notification"
			WHERE "forUserId" = '${userId}'
			 ORDER BY "createAt" DESC;`
		}
		//WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`
		db.query(query, (err, resp) => {
			if (err) {
				return res.status(404).json({ message: err.message });
			} else {
				return res.status(200).json( resp.rows );
			}
		})
	} catch (error) {

	}

}
module.exports = {
	getNotification: getNotification,
}

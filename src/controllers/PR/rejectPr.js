// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
const crypt = require("../../crypt/crypt");
var sleep = require('sleep');
const db = require("../../db/db");
const decodeJWT = require('jwt-decode');
const axios = require('axios');
const socIo = require("../../../server");
const apiSap = require("../../apiSap/apiSap");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let rejectPr = async (req, res) => {
	try {
		var userId = '';
		var notification = socIo;
		try {
			const token = req.headers.authorization.split(' ')[1];
			const basicAuth = Buffer.from(token, 'base64').toString('ascii');
			userId = basicAuth.split(':')[0];
		} catch (error) {
			const accessToken = crypt.decrypt(req.headers.authorization);
			const decodeTk = decodeJWT(accessToken);
			userId = decodeTk.userId.toUpperCase();
		}
		var username = 'giangph';
		var password = '1234567';
		// var credentials = btoa(username + ':' + password);
		// var basicAuth = 'Basic ' + credentials;

		var getPrSapSelect = await db.query(`select "PR_SAP","changeBy" from prm."PrTable" WHERE "PR_NO" = ${req.body.params.PR_NO}`);
		var PrSapRsData = {
			"PR_SAP": getPrSapSelect.rows[0].PR_SAP,
			"REL_CODE": "T1",
			"REJECT": "X"
		};
		// const options = {
		// 	method: 'POST',
		// 	auth: {
		// 		username: username,
		// 		password: password
		// 	},
		// 	headers: {
		// 		xsrfCookieName: 'XSRF-TOKEN',
		// 		xsrfHeaderName: 'X-XSRF-TOKEN',
		// 		"X-XSRF-TOKEN": 'ZoJgPjA294f2JdEV1bLyzQ==',
		// 		"x-csrf-token": 'Fetch',
		// 		"Content-Type": "application/x-www-form-urlencoded"
		// 	},
		// 	data: PrSapRsData,
		// 	url: `http://hana.ciber.vn:8007/sap/bc/zwebservice/zpr_release?sap-client=200`,
		// };
		// const data = await axios(options);
		const data = await apiSap.apiSap(`http://hana.ciber.vn:8007/sap/bc/zwebservice/zpr_release?sap-client=200`, PrSapRsData, 'POST');
		if (data.data.TYPE === 'S') {
			//update status
			//for table PR
			await db.query(`UPDATE prm."PrTable"
			SET "STATUS"=4, "StatusDescription"='Reject'
			WHERE "PR_NO"='${req.body.params.PR_NO}';`);
			// for table STRATEGY
			await db.query(`UPDATE prm."PR_RELEASE_STRATEGY"
			SET "ACTION_CODE"=2, "ACTION_DESCRIPTION"='Reject', "changeAt"='now()'
			WHERE "PR_NO"=${req.body.params.PR_NO} AND "userId"='${userId.toUpperCase()}';`);
			//Update table HISTORY
			// await db.query(``);
			//push notification
			try {
				for (let index in notification.ioObject.listUSer) {
					if (notification.ioObject.listUSer[index].userId.toUpperCase() === getPrSapSelect.rows[0].changeBy.toUpperCase()) {
						notification.ioObject.socketIo.to(notification.ioObject.listUSer[index].id).emit("sendDataServer", { CODE: 4, TYPE: 'PR', DESCRIPTION: 'RejectPR' });
					}
				}
				//insert to table notification
				await db.query(`INSERT INTO prm."Notification"(
				"forUserId","FromUserId","PR_NO", "StatusCode", "StatusDescription", "createAt", "changeAt", "NotiTypeDescription", "NotiType")
				VALUES ('${getPrSapSelect.rows[0].changeBy.toUpperCase()}','${userId}',${req.body.params.PR_NO}, '', 'pending', 'now()', 'now()', 'Reject your PR', 4);`);

			} catch (error) {
				console.log(error)
			}
			return res.status(200).json({ message: 'Success' });
		} else {
			return res.status(404).json({ message: 'Có lỗi gì đó!' });
		}
	} catch (error) {
		return res.status(404).json({ message: err.message });
	}

}
module.exports = {
	rejectPr: rejectPr,
}

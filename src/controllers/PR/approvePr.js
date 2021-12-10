// require('dotenv').config()
// const crypt = require("../../crypt/crypt");
// var sleep = require('sleep');
// const db = require("../../db/db");
// const decodeJWT = require('jwt-decode');
// /**
//  * controller login
//  * @param {*} req 
//  * @param {*} res 
//  */
// let approvePr = async (req, res) => {
// 	try {
// 		// await sleep.sleep(1);

// 		// const para = req.query.werks;

// 		Object.size = function (obj) {
// 			var size = 0,
// 				key;
// 			for (key in obj) {
// 				if (obj.hasOwnProperty(key)) size++;
// 			}
// 			return size;
// 		};
// 		var userId = '';
// 		try {
// 			const token = req.headers.authorization.split(' ')[1];
// 			const basicAuth = Buffer.from(token, 'base64').toString('ascii');
// 			userId = basicAuth.split(':')[0];
// 		} catch (error) {
// 			const accessToken = crypt.decrypt(req.headers.authorization);
// 			const decodeTk = decodeJWT(accessToken);
// 			userId = decodeTk.userId;
// 		}

// 		var	query = `SELECT * FROM prm."PR_RELEASE_STRATEGY" 
//         WHERE "PR_NO"=${String(req.query[Object.keys(req.query)[0]])}`;
// 		const checkApprovePr = await db.query(`${query}`);

// 		var release_level = null;
// 		for(let index in checkApprovePr.rows){
// 			if(checkApprovePr.rows)
// 		}

// 		db.query(query, (err, resp) => {
// 			if (err) {
// 				return res.status(404).json({ message: err.message });
// 			} else {

// 				return res.status(200).json( resp.rows );
// 			}
// 		})
// 	} catch (error) {

// 	}

// }
// module.exports = {
// 	approvePr: approvePr,
// }
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
let approvePr = async (req, res) => {
	try {
		var notification = socIo;
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
			userId = decodeTk.userId.toUpperCase();
		}
		// Get the size of an object
		var sizeQuery = Object.size(req.query);
		var sizeBody = Object.size(req.body);
		const PR_NO_VALUE = req.body.params ? req.body.params.PR_NO : req.body.PR_NO;
		var query;
		if (sizeQuery > 0 || sizeBody > 0) {
			query = `SELECT * FROM prm."PR_RELEASE_STRATEGY" 
        WHERE "${Object.keys(req.query)[0]}"=${String(req.query[Object.keys(req.query)[0]])};`
		} else {
			query = `SELECT * FROM prm."PR_RELEASE_STRATEGY" ;`
		}
		// get and check author for PR approve
		const author = await db.query(`select * from prm."PR_RELEASE_STRATEGY" WHERE
					 "PR_NO"=${PR_NO_VALUE} `);
		var RELEASE_LEVEL = null;
		for (let index in author.rows) {
			if (author.rows[index].userId === String(userId).toUpperCase()) {
				RELEASE_LEVEL = author.rows[index].RELEASE_LEVEL;
			}
		}
		var checkAuthorValue = true;
		const userRQ = await db.query(`select "createBy" from prm."PrTable" where "PR_NO"=${PR_NO_VALUE}`);
		for (let index = author.rows.length - 1; index >= 0; index--) {
			// if (RELEASE_LEVEL === 1 && author.rows[index].ACTION_CODE === 0) {
			// 	checkAuthorValue = true;
			// 	break;
			// }
			if (author.rows[index].RELEASE_LEVEL > RELEASE_LEVEL || (author.rows[index].RELEASE_LEVEL === RELEASE_LEVEL && author.rows[index].ACTION_CODE !== 1
				&& author.rows[index].userId !== userId.toUpperCase())) {
				//update status
				//for table PR
				checkAuthorValue = false;
				await db.query(`UPDATE prm."PrTable"
				SET "STATUS"=3, "StatusDescription"='In process'
				WHERE "PR_NO"='${PR_NO_VALUE}';`);
				// for table STRATEGY
				await db.query(`UPDATE prm."PR_RELEASE_STRATEGY"
				SET "ACTION_CODE"=1, "ACTION_DESCRIPTION"='Approve', "changeAt"='now()'
				WHERE "PR_NO"=${PR_NO_VALUE} AND "userId"='${userId.toUpperCase()}';`);

				//check and push notification
				var checkPushNotification = true;
				for (let i in author.rows) {
					if (author.rows[i].RELEASE_LEVEL === RELEASE_LEVEL && author.rows[i].ACTION_CODE !== 1 && author.rows[i].userId !== userId.toUpperCase()) {
						checkPushNotification = false;
						break;
					}
				}
				if (checkPushNotification) {
					const dataPushNotificationMobile = await db.query(`SELECT * FROM prm."NotificationMobileKey";`);
					try {
						var stringValue = `INSERT INTO prm."Notification"(
							"forUserId","FromUserId","PR_NO",  "StatusCode", "StatusDescription", "createAt", "changeAt", "NotiTypeDescription", "NotiType")
							VALUES`;
						var checkInsertNotification = 1;
						var today = new Date();
						for (let j in author.rows) {
							if (author.rows[j].RELEASE_LEVEL === RELEASE_LEVEL + 1) {
								for (let i in notification.ioObject.listUSer) {
									//notification for next approver
									if (notification.ioObject.listUSer[i].userId.toUpperCase() === author.rows[j].userId.toUpperCase()) {
										notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("sendDataServer", {
											Content: null,
											createAt: today,
											changeAt: today,
											forUserId: author.rows[j].userId.toUpperCase(),
											FromUserId: userRQ.rows[0].createBy.toUpperCase(),
											NotiType: 3,
											NotiTypeDescription: 'Requires approval PR ',
											PR_NO: PR_NO_VALUE,
											StatusCode: '',
											StatusDescription: 'pending'
										});
									}
									//notification for requester
									if (notification.ioObject.listUSer[i].userId.toUpperCase() === userRQ.rows[0].createBy.toUpperCase()) {
										notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("sendDataServer", {
											Content: null,
											createAt: today,
											changeAt: today,
											forUserId: userRQ.rows[0].createBy.toUpperCase(),
											FromUserId: userId,
											NotiType: 3,
											NotiTypeDescription: 'Approve your PR',
											PR_NO: PR_NO_VALUE,
											StatusCode: '',
											StatusDescription: 'pending'
										});
									}
								}
								//for mobile
								const options = {
									headers: {
										'Content-Type': 'application/json',
										'Authorization': `key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p`
									}
								};
								const data = {
									"registration_ids": [],
									"notification": {
										"body": `${userId}: Approve Request - ${PR_NO_VALUE}`,
										"PR_NO": PR_NO_VALUE,
										"OrganizationId": "2",
										"content_available": true,
										"priority": "high",
										"subtitle": "Elementary School",
										"title": "PR",
										"date": today
									},
									"data": {
										"priority": "high",
										"sound": "app_sound.wav",
										"content_available": true,
										"bodyText": PR_NO_VALUE,
										"organization": "Elementary school"
									}
								};
								for (let n in dataPushNotificationMobile.rows) {
									//for next approve
									if (dataPushNotificationMobile.rows[n].userId === author.rows[j].userId.toUpperCase()) {
										data.notification.body = `${userRQ.rows[0].createBy.toUpperCase()}: Requires approval PR - ${PR_NO_VALUE}`;
										data.registration_ids = [`${dataPushNotificationMobile.rows[n].Token}`]
										await axios.post('https://fcm.googleapis.com/fcm/send?', data, options)
											.then(function (response) {
												// handle success
												console.log(response);
											})
											.catch(function (error) {
												// handle error
												console.log(error);
											})
											.then(function () {
												// always executed
											});
									}
									//for mobile and requester
									if (dataPushNotificationMobile.rows[n].userId === userRQ.rows[0].createBy.toUpperCase()) {
										data.notification.body = `${userId}: Approve your PR  - ${PR_NO_VALUE}`;
										data.registration_ids = [`${dataPushNotificationMobile.rows[n].Token}`]
										await axios.post('https://fcm.googleapis.com/fcm/send?', data, options)
											.then(function (response) {
												// handle success
												console.log(response);
											})
											.catch(function (error) {
												// handle error
												console.log(error);
											})
											.then(function () {
												// always executed
											});
									}
								}

								//string for insert table notification
								var stringValueChiden = '';
								if (checkInsertNotification === 1) {
									stringValueChiden = `('${author.rows[j].userId.toUpperCase()}','${userId}',${PR_NO_VALUE}, '', 'pending', 'now()', 'now()', 'Approve Request', 3)`;
								} else {
									stringValueChiden = `,('${author.rows[j].userId.toUpperCase()}','${userId}',${PR_NO_VALUE}, '', 'pending', 'now()', 'now()', 'Approve Request', 3)`;
								}
								stringValue += stringValueChiden;
								checkInsertNotification += 1;
							}

						}
						//insert to table notification
						if (checkInsertNotification > 1) {
							stringValue += `,('${userRQ.rows[0].createBy.toUpperCase()}','${userId}',${PR_NO_VALUE}, '', 'pending', 'now()', 'now()', 'Approve your PR', 3)`;
							await db.query(`${stringValue}`);
						}

					} catch (error) {
						console.log(error)
					}

				}
				break;
			}
		}
		//approve for complete
		if (checkAuthorValue) {
			var getPrSapSelect = await db.query(`select "PR_SAP" from prm."PrTable" WHERE "PR_NO" = ${PR_NO_VALUE}`);
			var PrSapRsData = {
				"PR_SAP": getPrSapSelect.rows[0].PR_SAP,
				"REL_CODE": "T1",
				"REJECT": ""
			};
			// const data = await axios(options);
			const data = await apiSap.apiSap(`http://hana.ciber.vn:8007/sap/bc/zwebservice/zpr_release?sap-client=200`, PrSapRsData, 'POST');
			if (data.data.TYPE === 'S') {
				//update status
				//for table PR
				await db.query(`UPDATE prm."PrTable"
				SET "STATUS"=5, "StatusDescription"='Complete'
				WHERE "PR_NO"='${PR_NO_VALUE}';`);
				// for table STRATEGY
				await db.query(`UPDATE prm."PR_RELEASE_STRATEGY"
				SET "ACTION_CODE"=1, "ACTION_DESCRIPTION"='Approve', "changeAt"='now()'
				WHERE "PR_NO"=${PR_NO_VALUE} AND "userId"='${userId.toUpperCase()}';`);
				//Update table HISTORY
				// await db.query(``);
				//push notification
				// const userRQ = await db.query(`select "createBy" from prm."PrTable" where "PR_NO"=${PR_NO_VALUE}`);
				const dataPushNotificationMobile = await db.query(`SELECT * FROM prm."NotificationMobileKey";`);
				var today = new Date();
				for (let i in notification.ioObject.listUSer) {
					if (notification.ioObject.listUSer[i].userId.toUpperCase() === userRQ.rows[0].createBy.toUpperCase()) {
						notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("sendDataServer", {
							Content: null,
							createAt: today,
							changeAt: today,
							forUserId: userRQ.rows[0].createBy.toUpperCase(),
							FromUserId: userId,
							NotiType: 5,
							NotiTypeDescription: 'Approve complete',
							PR_NO: PR_NO_VALUE,
							StatusCode: '',
							StatusDescription: 'pending'
						});
					}
				}
				for (let n in dataPushNotificationMobile.rows) {
					if (dataPushNotificationMobile.rows[n].userId === userRQ.rows[0].createBy.toUpperCase()) {
						const options = {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p`
							}
						};
						const data = {
							"registration_ids": [],
							"notification": {
								"body": `${userId}: Approve Complete your PR - ${PR_NO_VALUE}`,
								"PR_NO": PR_NO_VALUE,
								"OrganizationId": "2",
								"content_available": true,
								"priority": "high",
								"subtitle": "Elementary School",
								"title": "PR",
								"date": today
							},
							"data": {
								"priority": "high",
								"sound": "app_sound.wav",
								"content_available": true,
								"bodyText": PR_NO_VALUE,
								"organization": "Elementary school"
							}
						};
						data.registration_ids = [`${dataPushNotificationMobile.rows[n].Token}`]
						await axios.post('https://fcm.googleapis.com/fcm/send?', data, options)
							.then(function (response) {
								// handle success
								// console.log(response);
							})
							.catch(function (error) {
								// handle error
								// console.log(error);
							})
							.then(function () {
								// always executed
							});
					}
				}
				//insert to table notification
				await db.query(`INSERT INTO prm."Notification"(
					"forUserId","FromUserId","PR_NO", "StatusCode", "StatusDescription", "createAt", "changeAt", "NotiTypeDescription", "NotiType")
					VALUES ('${userRQ.rows[0].createBy.toUpperCase()}','${userId}',${PR_NO_VALUE}, '', 'pending', 'now()', 'now()', 'Approve complete', 5);`);
				return res.status(200).json({ message: 'Success', code: 5 });
			} else {
				return res.status(200).json({ message: 'Success', data: data.data.MESSAGE });
			}
		} else {
			return res.status(200).json({ message: 'Success', code: 3 });
		}

	} catch (error) {
		return res.status(404).json({ message: error.message });
	}

}
module.exports = {
	approvePr: approvePr,
}

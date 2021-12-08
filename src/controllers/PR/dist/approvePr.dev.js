"use strict";

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
require('dotenv').config();

var crypt = require("../../crypt/crypt");

var sleep = require('sleep');

var db = require("../../db/db");

var decodeJWT = require('jwt-decode');

var axios = require('axios');

var socIo = require("../../../server");

var apiSap = require("../../apiSap/apiSap");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var approvePr = function approvePr(req, res) {
  var notification, userId, token, basicAuth, accessToken, decodeTk, sizeQuery, sizeBody, PR_NO_VALUE, query, author, RELEASE_LEVEL, index, checkAuthorValue, userRQ, _index, checkPushNotification, i, stringValue, checkInsertNotification, today, j, _i, stringValueChiden, getPrSapSelect, PrSapRsData, data, _i2;

  return regeneratorRuntime.async(function approvePr$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          notification = socIo;

          Object.size = function (obj) {
            var size = 0,
                key;

            for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
            }

            return size;
          }; //get user call


          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0];
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId.toUpperCase();
          } // Get the size of an object


          sizeQuery = Object.size(req.query);
          sizeBody = Object.size(req.body);
          PR_NO_VALUE = req.body.params ? req.body.params.PR_NO : req.body.PR_NO;

          if (sizeQuery > 0 || sizeBody > 0) {
            query = "SELECT * FROM prm.\"PR_RELEASE_STRATEGY\" \n        WHERE \"".concat(Object.keys(req.query)[0], "\"=").concat(String(req.query[Object.keys(req.query)[0]]), ";");
          } else {
            query = "SELECT * FROM prm.\"PR_RELEASE_STRATEGY\" ;";
          } // get and check author for PR approve


          _context.next = 11;
          return regeneratorRuntime.awrap(db.query("select * from prm.\"PR_RELEASE_STRATEGY\" WHERE\n\t\t\t\t\t \"PR_NO\"=".concat(PR_NO_VALUE, " ")));

        case 11:
          author = _context.sent;
          RELEASE_LEVEL = null;

          for (index in author.rows) {
            if (author.rows[index].userId === String(userId).toUpperCase()) {
              RELEASE_LEVEL = author.rows[index].RELEASE_LEVEL;
            }
          }

          checkAuthorValue = true;
          _context.next = 17;
          return regeneratorRuntime.awrap(db.query("select \"createBy\" from prm.\"PrTable\" where \"PR_NO\"=".concat(PR_NO_VALUE)));

        case 17:
          userRQ = _context.sent;
          _index = author.rows.length - 1;

        case 19:
          if (!(_index >= 0)) {
            _context.next = 54;
            break;
          }

          if (!(author.rows[_index].RELEASE_LEVEL > RELEASE_LEVEL || author.rows[_index].RELEASE_LEVEL === RELEASE_LEVEL && author.rows[_index].ACTION_CODE !== 1 && author.rows[_index].userId !== userId.toUpperCase())) {
            _context.next = 51;
            break;
          }

          //update status
          //for table PR
          checkAuthorValue = false;
          _context.next = 24;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n\t\t\t\tSET \"STATUS\"=3, \"StatusDescription\"='In process'\n\t\t\t\tWHERE \"PR_NO\"='".concat(PR_NO_VALUE, "';")));

        case 24:
          _context.next = 26;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PR_RELEASE_STRATEGY\"\n\t\t\t\tSET \"ACTION_CODE\"=1, \"ACTION_DESCRIPTION\"='Approve', \"changeAt\"='now()'\n\t\t\t\tWHERE \"PR_NO\"=".concat(PR_NO_VALUE, " AND \"userId\"='").concat(userId.toUpperCase(), "';")));

        case 26:
          //check and push notification
          checkPushNotification = true;
          _context.t0 = regeneratorRuntime.keys(author.rows);

        case 28:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 35;
            break;
          }

          i = _context.t1.value;

          if (!(author.rows[i].RELEASE_LEVEL === RELEASE_LEVEL && author.rows[i].ACTION_CODE !== 1 && author.rows[i].userId !== userId.toUpperCase())) {
            _context.next = 33;
            break;
          }

          checkPushNotification = false;
          return _context.abrupt("break", 35);

        case 33:
          _context.next = 28;
          break;

        case 35:
          if (!checkPushNotification) {
            _context.next = 50;
            break;
          }

          _context.prev = 36;
          stringValue = "INSERT INTO prm.\"Notification\"(\n\t\t\t\t\t\t\t\"forUserId\",\"FromUserId\",\"PR_NO\",  \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n\t\t\t\t\t\t\tVALUES";
          checkInsertNotification = 1;
          today = new Date();

          for (j in author.rows) {
            if (author.rows[j].RELEASE_LEVEL === RELEASE_LEVEL + 1) {
              for (_i in notification.ioObject.listUSer) {
                //notification for next approver
                if (notification.ioObject.listUSer[_i].userId.toUpperCase() === author.rows[j].userId.toUpperCase()) {
                  notification.ioObject.socketIo.to(notification.ioObject.listUSer[_i].id).emit("sendDataServer", {
                    Content: null,
                    createAt: today,
                    changeAt: today,
                    forUserId: author.rows[j].userId.toUpperCase(),
                    FromUserId: userRQ.rows[0].createBy.toUpperCase(),
                    NotiType: 3,
                    NotiTypeDescription: 'Approve Request',
                    PR_NO: PR_NO_VALUE,
                    StatusCode: '',
                    StatusDescription: 'pending'
                  });
                } //notification for requester


                if (notification.ioObject.listUSer[_i].userId.toUpperCase() === userRQ.rows[0].createBy.toUpperCase()) {
                  notification.ioObject.socketIo.to(notification.ioObject.listUSer[_i].id).emit("sendDataServer", {
                    Content: null,
                    createAt: today,
                    changeAt: today,
                    forUserId: userRQ.rows[0].createBy.toUpperCase(),
                    FromUserId: userId,
                    NotiType: 3,
                    NotiTypeDescription: 'Approve Request',
                    PR_NO: PR_NO_VALUE,
                    StatusCode: '',
                    StatusDescription: 'pending'
                  });
                }
              } //string for insert table notification


              stringValueChiden = '';

              if (checkInsertNotification === 1) {
                stringValueChiden = "('".concat(author.rows[j].userId.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
              } else {
                stringValueChiden = ",('".concat(author.rows[j].userId.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
              }

              stringValue += stringValueChiden;
              checkInsertNotification += 1;
            }
          } //insert to table notification


          if (!(checkInsertNotification > 1)) {
            _context.next = 45;
            break;
          }

          stringValue += ",('".concat(userRQ.rows[0].createBy.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve your PR', 3)");
          _context.next = 45;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue)));

        case 45:
          _context.next = 50;
          break;

        case 47:
          _context.prev = 47;
          _context.t2 = _context["catch"](36);
          console.log(_context.t2);

        case 50:
          return _context.abrupt("break", 54);

        case 51:
          _index--;
          _context.next = 19;
          break;

        case 54:
          if (!checkAuthorValue) {
            _context.next = 77;
            break;
          }

          _context.next = 57;
          return regeneratorRuntime.awrap(db.query("select \"PR_SAP\" from prm.\"PrTable\" WHERE \"PR_NO\" = ".concat(PR_NO_VALUE)));

        case 57:
          getPrSapSelect = _context.sent;
          PrSapRsData = {
            "PR_SAP": getPrSapSelect.rows[0].PR_SAP,
            "REL_CODE": "T1",
            "REJECT": ""
          }; //cal api approve PR sap
          // var username = 'giangph';
          // var password = '1234567';
          // // var credentials = btoa(username + ':' + password);
          // // var basicAuth = 'Basic ' + credentials;
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

          _context.next = 61;
          return regeneratorRuntime.awrap(apiSap.apiSap("http://hana.ciber.vn:8007/sap/bc/zwebservice/zpr_release?sap-client=200", PrSapRsData, 'POST'));

        case 61:
          data = _context.sent;

          if (!(data.data.TYPE === 'S')) {
            _context.next = 74;
            break;
          }

          _context.next = 65;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n\t\t\t\tSET \"STATUS\"=5, \"StatusDescription\"='Complete'\n\t\t\t\tWHERE \"PR_NO\"='".concat(PR_NO_VALUE, "';")));

        case 65:
          _context.next = 67;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PR_RELEASE_STRATEGY\"\n\t\t\t\tSET \"ACTION_CODE\"=1, \"ACTION_DESCRIPTION\"='Approve', \"changeAt\"='now()'\n\t\t\t\tWHERE \"PR_NO\"=".concat(PR_NO_VALUE, " AND \"userId\"='").concat(userId.toUpperCase(), "';")));

        case 67:
          //Update table HISTORY
          // await db.query(``);
          //push notification
          // const userRQ = await db.query(`select "createBy" from prm."PrTable" where "PR_NO"=${PR_NO_VALUE}`);
          today = new Date();

          for (_i2 in notification.ioObject.listUSer) {
            if (notification.ioObject.listUSer[_i2].userId.toUpperCase() === userRQ.rows[0].createBy.toUpperCase()) {
              notification.ioObject.socketIo.to(notification.ioObject.listUSer[_i2].id).emit("sendDataServer", {
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
          } //insert to table notification


          _context.next = 71;
          return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"Notification\"(\n\t\t\t\t\t\"forUserId\",\"FromUserId\",\"PR_NO\", \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n\t\t\t\t\tVALUES ('".concat(userRQ.rows[0].createBy.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve complete', 5);")));

        case 71:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success',
            code: 5
          }));

        case 74:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success',
            data: data.data.MESSAGE
          }));

        case 75:
          _context.next = 78;
          break;

        case 77:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success',
            code: 3
          }));

        case 78:
          _context.next = 83;
          break;

        case 80:
          _context.prev = 80;
          _context.t3 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t3.message
          }));

        case 83:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 80], [36, 47]]);
};

module.exports = {
  approvePr: approvePr
};
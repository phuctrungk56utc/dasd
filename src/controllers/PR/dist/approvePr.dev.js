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
  var notification, userId, token, basicAuth, accessToken, decodeTk, sizeQuery, sizeBody, PR_NO_VALUE, query, author, RELEASE_LEVEL, index, checkAuthorValue, userRQ, _index, checkPushNotification, i, dataPushNotificationMobile, stringValue, checkInsertNotification, today, j, _i, options, data, n, stringValueChiden, getPrSapSelect, PrSapRsData, _data, _dataPushNotificationMobile, _i2, _n, _options, _data2;

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
            userId = basicAuth.split(':')[0].toUpperCase();
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId.toUpperCase();
          } // Get the size of an object


          sizeQuery = Object.size(req.query);
          sizeBody = Object.size(req.body);
          PR_NO_VALUE = req.body.params ? req.body.params.data.PR_NO : req.body.PR_NO; // console.log(req.body.params)

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
            _context.next = 84;
            break;
          }

          if (!(author.rows[_index].RELEASE_LEVEL > RELEASE_LEVEL || author.rows[_index].RELEASE_LEVEL === RELEASE_LEVEL && author.rows[_index].ACTION_CODE !== 1 && author.rows[_index].userId !== userId.toUpperCase())) {
            _context.next = 81;
            break;
          }

          //update status
          //for table PR
          checkAuthorValue = false;
          _context.next = 24;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n\t\t\t\tSET \"STATUS\"=3, \"StatusDescription\"='In process', \"Note\"='".concat(req.body.params.data.Note === null ? '' : req.body.params.data.Note, "'\n\t\t\t\tWHERE \"PR_NO\"='").concat(PR_NO_VALUE, "';")));

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
            _context.next = 80;
            break;
          }

          _context.next = 38;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM prm.\"NotificationMobileKey\";"));

        case 38:
          dataPushNotificationMobile = _context.sent;
          _context.prev = 39;
          stringValue = "INSERT INTO prm.\"Notification\"(\n\t\t\t\t\t\t\t\"forUserId\",\"FromUserId\",\"PR_NO\",  \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n\t\t\t\t\t\t\tVALUES";
          checkInsertNotification = 1;
          today = new Date();
          _context.t2 = regeneratorRuntime.keys(author.rows);

        case 44:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 71;
            break;
          }

          j = _context.t3.value;

          if (!(author.rows[j].RELEASE_LEVEL === RELEASE_LEVEL + 1)) {
            _context.next = 69;
            break;
          }

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
                NotiTypeDescription: 'Requires approval PR ',
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
                NotiTypeDescription: 'Approve your PR',
                PR_NO: PR_NO_VALUE,
                StatusCode: '',
                StatusDescription: 'pending'
              });
            }
          } //for mobile


          options = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p"
            }
          };
          data = {
            "registration_ids": [],
            "notification": {
              "body": "".concat(userId, ": Approve Request - ").concat(PR_NO_VALUE),
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
          _context.t4 = regeneratorRuntime.keys(dataPushNotificationMobile.rows);

        case 51:
          if ((_context.t5 = _context.t4()).done) {
            _context.next = 65;
            break;
          }

          n = _context.t5.value;

          if (!(dataPushNotificationMobile.rows[n].userId === author.rows[j].userId.toUpperCase())) {
            _context.next = 58;
            break;
          }

          data.notification.body = "".concat(userRQ.rows[0].createBy.toUpperCase(), ": Requires approval PR - ").concat(PR_NO_VALUE);
          data.registration_ids = ["".concat(dataPushNotificationMobile.rows[n].Token)];
          _context.next = 58;
          return regeneratorRuntime.awrap(axios.post('https://fcm.googleapis.com/fcm/send?', data, options).then(function (response) {
            // handle success
            console.log(response);
          })["catch"](function (error) {
            // handle error
            console.log(error);
          }).then(function () {// always executed
          }));

        case 58:
          if (!(dataPushNotificationMobile.rows[n].userId === userRQ.rows[0].createBy.toUpperCase())) {
            _context.next = 63;
            break;
          }

          data.notification.body = "".concat(userId, ": Approve your PR  - ").concat(PR_NO_VALUE);
          data.registration_ids = ["".concat(dataPushNotificationMobile.rows[n].Token)];
          _context.next = 63;
          return regeneratorRuntime.awrap(axios.post('https://fcm.googleapis.com/fcm/send?', data, options).then(function (response) {
            // handle success
            console.log(response);
          })["catch"](function (error) {
            // handle error
            console.log(error);
          }).then(function () {// always executed
          }));

        case 63:
          _context.next = 51;
          break;

        case 65:
          //string for insert table notification
          stringValueChiden = '';

          if (checkInsertNotification === 1) {
            stringValueChiden = "('".concat(author.rows[j].userId.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
          } else {
            stringValueChiden = ",('".concat(author.rows[j].userId.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
          }

          stringValue += stringValueChiden;
          checkInsertNotification += 1;

        case 69:
          _context.next = 44;
          break;

        case 71:
          if (!(checkInsertNotification > 1)) {
            _context.next = 75;
            break;
          }

          stringValue += ",('".concat(userRQ.rows[0].createBy.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve your PR', 3)");
          _context.next = 75;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue)));

        case 75:
          _context.next = 80;
          break;

        case 77:
          _context.prev = 77;
          _context.t6 = _context["catch"](39);
          console.log(_context.t6);

        case 80:
          return _context.abrupt("break", 84);

        case 81:
          _index--;
          _context.next = 19;
          break;

        case 84:
          if (!checkAuthorValue) {
            _context.next = 121;
            break;
          }

          _context.next = 87;
          return regeneratorRuntime.awrap(db.query("select \"PR_SAP\" from prm.\"PrTable\" WHERE \"PR_NO\" = ".concat(PR_NO_VALUE)));

        case 87:
          getPrSapSelect = _context.sent;
          PrSapRsData = {
            "PR_SAP": getPrSapSelect.rows[0].PR_SAP,
            "REL_CODE": "T1",
            "REJECT": ""
          }; // const data = await axios(options);

          _context.next = 91;
          return regeneratorRuntime.awrap(apiSap.apiSap("http://hana.ciber.vn:8007/sap/bc/zwebservice/zpr_release?sap-client=200", PrSapRsData, 'POST'));

        case 91:
          _data = _context.sent;

          if (!(_data.data.TYPE === 'S')) {
            _context.next = 118;
            break;
          }

          _context.next = 95;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n\t\t\t\tSET \"STATUS\"=5, \"StatusDescription\"='Complete'\n\t\t\t\tWHERE \"PR_NO\"='".concat(PR_NO_VALUE, "';")));

        case 95:
          _context.next = 97;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PR_RELEASE_STRATEGY\"\n\t\t\t\tSET \"ACTION_CODE\"=1, \"ACTION_DESCRIPTION\"='Approve', \"changeAt\"='now()'\n\t\t\t\tWHERE \"PR_NO\"=".concat(PR_NO_VALUE, " AND \"userId\"='").concat(userId.toUpperCase(), "';")));

        case 97:
          _context.next = 99;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM prm.\"NotificationMobileKey\";"));

        case 99:
          _dataPushNotificationMobile = _context.sent;
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
          }

          _context.t7 = regeneratorRuntime.keys(_dataPushNotificationMobile.rows);

        case 103:
          if ((_context.t8 = _context.t7()).done) {
            _context.next = 113;
            break;
          }

          _n = _context.t8.value;

          if (!(_dataPushNotificationMobile.rows[_n].userId === userRQ.rows[0].createBy.toUpperCase())) {
            _context.next = 111;
            break;
          }

          _options = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p"
            }
          };
          _data2 = {
            "registration_ids": [],
            "notification": {
              "body": "".concat(userId, ": Approve Complete your PR - ").concat(PR_NO_VALUE),
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
          _data2.registration_ids = ["".concat(_dataPushNotificationMobile.rows[_n].Token)];
          _context.next = 111;
          return regeneratorRuntime.awrap(axios.post('https://fcm.googleapis.com/fcm/send?', _data2, _options).then(function (response) {// handle success
            // console.log(response);
          })["catch"](function (error) {// handle error
            // console.log(error);
          }).then(function () {// always executed
          }));

        case 111:
          _context.next = 103;
          break;

        case 113:
          _context.next = 115;
          return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"Notification\"(\n\t\t\t\t\t\"forUserId\",\"FromUserId\",\"PR_NO\", \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n\t\t\t\t\tVALUES ('".concat(userRQ.rows[0].createBy.toUpperCase(), "','").concat(userId, "',").concat(PR_NO_VALUE, ", '', 'pending', 'now()', 'now()', 'Approve complete', 5);")));

        case 115:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success',
            code: 5
          }));

        case 118:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success',
            data: _data.data.MESSAGE
          }));

        case 119:
          _context.next = 122;
          break;

        case 121:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success',
            code: 3
          }));

        case 122:
          _context.next = 127;
          break;

        case 124:
          _context.prev = 124;
          _context.t9 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t9.message
          }));

        case 127:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 124], [39, 77]]);
};

module.exports = {
  approvePr: approvePr
};
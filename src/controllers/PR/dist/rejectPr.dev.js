"use strict";

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


var rejectPr = function rejectPr(req, res) {
  var userId, notification, token, basicAuth, accessToken, decodeTk, username, password, getPrSapSelect, PrSapRsData, data, dataPushNotificationMobile, today, index, options, n, _data;

  return regeneratorRuntime.async(function rejectPr$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = '';
          notification = socIo;

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0].toUpperCase();
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId.toUpperCase();
          }

          username = 'giangph';
          password = '1234567'; // var credentials = btoa(username + ':' + password);
          // var basicAuth = 'Basic ' + credentials;

          _context.next = 8;
          return regeneratorRuntime.awrap(db.query("select \"PR_SAP\",\"changeBy\" from prm.\"PrTable\" WHERE \"PR_NO\" = ".concat(req.body.params.data.PR_NO)));

        case 8:
          getPrSapSelect = _context.sent;
          PrSapRsData = {
            "PR_SAP": getPrSapSelect.rows[0].PR_SAP,
            "REL_CODE": "T1",
            "REJECT": "X"
          }; // const options = {
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

          _context.next = 12;
          return regeneratorRuntime.awrap(apiSap.apiSap("http://hana.ciber.vn:8007/sap/bc/zwebservice/zpr_release?sap-client=200", PrSapRsData, 'POST'));

        case 12:
          data = _context.sent;

          if (!(data.data.TYPE === 'S')) {
            _context.next = 44;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n\t\t\tSET \"STATUS\"=4, \"StatusDescription\"='Reject' , \"Note\"='".concat(req.body.params.data.Note === null ? '' : req.body.params.data.Note, "'\n\t\t\tWHERE \"PR_NO\"='").concat(req.body.params.data.PR_NO, "';")));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PR_RELEASE_STRATEGY\"\n\t\t\tSET \"ACTION_CODE\"=2, \"ACTION_DESCRIPTION\"='Reject', \"changeAt\"='now()'\n\t\t\tWHERE \"PR_NO\"=".concat(req.body.params.data.PR_NO, " AND \"userId\"='").concat(userId.toUpperCase(), "';")));

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM prm.\"NotificationMobileKey\";"));

        case 20:
          dataPushNotificationMobile = _context.sent;
          today = new Date();
          _context.prev = 22;

          for (index in notification.ioObject.listUSer) {
            if (notification.ioObject.listUSer[index].userId.toUpperCase() === getPrSapSelect.rows[0].changeBy.toUpperCase()) {
              notification.ioObject.socketIo.to(notification.ioObject.listUSer[index].id).emit("sendDataServer", {
                Content: null,
                createAt: today,
                changeAt: today,
                forUserId: getPrSapSelect.rows[0].changeBy.toUpperCase(),
                FromUserId: userId,
                NotiType: 4,
                NotiTypeDescription: 'Reject your PR',
                PR_NO: req.body.params.data.PR_NO,
                StatusCode: '',
                StatusDescription: 'pending'
              });
            }
          } //push for mobile


          options = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p"
            }
          };
          _context.t0 = regeneratorRuntime.keys(dataPushNotificationMobile.rows);

        case 26:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 34;
            break;
          }

          n = _context.t1.value;

          if (!(dataPushNotificationMobile.rows[n].userId === getPrSapSelect.rows[0].changeBy.toUpperCase())) {
            _context.next = 32;
            break;
          }

          _data = {
            "registration_ids": ["".concat(dataPushNotificationMobile.rows[n].Token)],
            "notification": {
              "body": "".concat(userId, ": Reject your PR - ").concat(req.body.params.data.PR_NO),
              "PR_NO": req.body.params.data.PR_NO,
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
              "bodyText": req.body.params.data.PR_NO,
              "organization": "Elementary school"
            }
          };
          _context.next = 32;
          return regeneratorRuntime.awrap(axios.post('https://fcm.googleapis.com/fcm/send?', _data, options).then(function (response) {// handle success
            // console.log(response);
          })["catch"](function (error) {// handle error
            // console.log(error);
          }).then(function () {// always executed
          }));

        case 32:
          _context.next = 26;
          break;

        case 34:
          _context.next = 36;
          return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"Notification\"(\n\t\t\t\t\"forUserId\",\"FromUserId\",\"PR_NO\", \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n\t\t\t\tVALUES ('".concat(getPrSapSelect.rows[0].changeBy.toUpperCase(), "','").concat(userId, "',").concat(req.body.params.data.PR_NO, ", '', 'pending', 'now()', 'now()', 'Reject your PR', 4);")));

        case 36:
          _context.next = 41;
          break;

        case 38:
          _context.prev = 38;
          _context.t2 = _context["catch"](22);
          console.log(_context.t2);

        case 41:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success'
          }));

        case 44:
          return _context.abrupt("return", res.status(404).json({
            message: 'Có lỗi gì đó!'
          }));

        case 45:
          _context.next = 50;
          break;

        case 47:
          _context.prev = 47;
          _context.t3 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: err.message
          }));

        case 50:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 47], [22, 38]]);
};

module.exports = {
  rejectPr: rejectPr
};
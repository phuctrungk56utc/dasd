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
  var userId, notification, token, basicAuth, accessToken, decodeTk, username, password, getPrSapSelect, PrSapRsData, data, index;
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
            userId = basicAuth.split(':')[0];
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId.toUpperCase();
          }

          username = 'giangph';
          password = '1234567'; // var credentials = btoa(username + ':' + password);
          // var basicAuth = 'Basic ' + credentials;

          _context.next = 8;
          return regeneratorRuntime.awrap(db.query("select \"PR_SAP\",\"changeBy\" from prm.\"PrTable\" WHERE \"PR_NO\" = ".concat(req.body.params.PR_NO)));

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
            _context.next = 30;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n\t\t\tSET \"STATUS\"=4, \"StatusDescription\"='Reject'\n\t\t\tWHERE \"PR_NO\"='".concat(req.body.params.PR_NO, "';")));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PR_RELEASE_STRATEGY\"\n\t\t\tSET \"ACTION_CODE\"=2, \"ACTION_DESCRIPTION\"='Reject', \"changeAt\"='now()'\n\t\t\tWHERE \"PR_NO\"=".concat(req.body.params.PR_NO, " AND \"userId\"='").concat(userId.toUpperCase(), "';")));

        case 18:
          _context.prev = 18;

          for (index in notification.ioObject.listUSer) {
            if (notification.ioObject.listUSer[index].userId.toUpperCase() === getPrSapSelect.rows[0].changeBy.toUpperCase()) {
              notification.ioObject.socketIo.to(notification.ioObject.listUSer[index].id).emit("sendDataServer", {
                CODE: 4,
                TYPE: 'PR',
                DESCRIPTION: 'RejectPR'
              });
            }
          } //insert to table notification


          _context.next = 22;
          return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"Notification\"(\n\t\t\t\t\"forUserId\",\"FromUserId\",\"PR_NO\", \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n\t\t\t\tVALUES ('".concat(getPrSapSelect.rows[0].changeBy.toUpperCase(), "','").concat(userId, "',").concat(req.body.params.PR_NO, ", '', 'pending', 'now()', 'now()', 'Reject your PR', 4);")));

        case 22:
          _context.next = 27;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](18);
          console.log(_context.t0);

        case 27:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success'
          }));

        case 30:
          return _context.abrupt("return", res.status(404).json({
            message: 'Có lỗi gì đó!'
          }));

        case 31:
          _context.next = 36;
          break;

        case 33:
          _context.prev = 33;
          _context.t1 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: err.message
          }));

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 33], [18, 24]]);
};

module.exports = {
  rejectPr: rejectPr
};
"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // var sleep = require('sleep');


var db = require("../../../db/db");

var socIo = require("../../../../server"); // const apiSap = require("../../../apiSap/apiSap");
// const axios = require('axios')

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var updateTablePrAndRelease = function updateTablePrAndRelease(resultSap, req, dataCallSap, userId) {
  var notification, stringRelease, lengX, index, stringValueChidden, release_ID, rs, userRl, query_PR_RL_STRA, stringValueNoti, checkInsertNotification, _index, i, stringValueChidenNoti;

  return regeneratorRuntime.async(function updateTablePrAndRelease$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          notification = socIo;
          stringRelease = "select \"Release_ID\" from prm.\"PR\" WHERE ";
          lengX = resultSap.COND_RELEASE.length;

          for (index in resultSap.COND_RELEASE) {
            stringValueChidden = '';
            stringValueChidden = "\"".concat(resultSap.COND_RELEASE[index].FIELD_NAME, "_From\" <= ").concat(resultSap.COND_RELEASE[index].FIELD_VALUE, " AND\n                                       \"").concat(resultSap.COND_RELEASE[index].FIELD_NAME, "_To\" >= ").concat(resultSap.COND_RELEASE[index].FIELD_VALUE);

            if (lengX > Number(index) + 1) {
              stringValueChidden += 'AND';
            }

            stringRelease += stringValueChidden;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(db.query("".concat(stringRelease, ";")));

        case 7:
          release_ID = _context.sent;

          if (!(release_ID.rows.length === 0)) {
            _context.next = 21;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                SET \"PR_SAP\"=".concat(resultSap.HEADER.PR_SAP, ", \"DESCRIPTION\"='").concat(dataCallSap.HEADER.DESCRIPTION, "', \"changeBy\"='").concat(userId, "',\"STATUS\"=5, \n                \"StatusDescription\"='Complete', \"LOCAL_AMOUNT\"=").concat(resultSap.HEADER.LOCAL_AMOUNT, ", \n                \"WAERS\"='").concat(resultSap.HEADER.WAERS ? resultSap.HEADER.WAERS : '', "', \"HWAERS\"='").concat(resultSap.HEADER.HWAERS ? resultSap.HEADER.HWAERS : '', "', \n                \"changeAt\"=now(), \"Release_ID\"=''\n                WHERE \"PR_NO\"=").concat(resultSap.HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\";")));

        case 11:
          rs = _context.sent;
          resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          resultSap.HEADER.createBy = rs.rows[0].createBy;
          resultSap.HEADER.changeAt = rs.rows[0].changeAt;
          resultSap.HEADER.STATUS = rs.rows[0].STATUS;
          return _context.abrupt("return", resultSap);

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                SET \"PR_SAP\" = ".concat(resultSap.HEADER.PR_SAP, ",\"STATUS\"=2,\"LOCAL_AMOUNT\" = ").concat(resultSap.HEADER.LOCAL_AMOUNT, ",\n                \"Release_ID\"='").concat(release_ID.rows[0].Release_ID, "',\n                \"HWAERS\"='").concat(resultSap.HEADER.HWAERS, "'\n                WHERE \"PR_NO\"=").concat(resultSap.HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\"")));

        case 23:
          rs = _context.sent;
          resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          resultSap.HEADER.createBy = rs.rows[0].createBy;
          resultSap.HEADER.changeAt = rs.rows[0].changeAt;
          resultSap.HEADER.STATUS = rs.rows[0].STATUS;
          _context.next = 32;
          return regeneratorRuntime.awrap(db.query("select \"Release_Level\", \"userId\" from prm.\"Strategy\" WHERE \"Release_ID\" = '".concat(release_ID.rows[0].Release_ID, "' and \"ReleaseType\" = 'PR'")));

        case 32:
          userRl = _context.sent;
          _context.next = 35;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PR_RELEASE_STRATEGY\"\n                WHERE \"PR_NO\"=".concat(resultSap.HEADER.PR_NO, ";")));

        case 35:
          query_PR_RL_STRA = "INSERT INTO prm.\"PR_RELEASE_STRATEGY\" (\"PR_NO\",\"userId\",\"RELEASE_LEVEL\") VALUES";
          lengX = userRl.rows.length;
          stringValueNoti = "INSERT INTO prm.\"Notification\"(\n                    \"forUserId\",\"FromUserId\",\"PR_NO\", \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n                    VALUES";
          checkInsertNotification = 1;

          for (_index in userRl.rows) {
            //push notification
            try {
              if (Number(userRl.rows[_index].Release_Level) === 1) {
                for (i in notification.ioObject.listUSer) {
                  if (notification.ioObject.listUSer[i].userId.toUpperCase() === userRl.rows[_index].userId.toUpperCase()) {
                    notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("sendDataServer", {
                      CODE: 0,
                      TYPE: 'PR',
                      DESCRIPTION: 'REQUIRED APPROVE'
                    });
                  }
                } //string for insert table notification


                stringValueChidenNoti = '';

                if (checkInsertNotification === 1) {
                  stringValueChidenNoti = "('".concat(userRl.rows[_index].userId.toUpperCase(), "','").concat(userId, "','").concat(resultSap.HEADER.PR_NO, "', '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
                } else {
                  stringValueChidenNoti = ",('".concat(userRl.rows[_index].userId.toUpperCase(), "','").concat(userId, "','").concat(resultSap.HEADER.PR_NO, "', '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
                }

                stringValueNoti += stringValueChidenNoti;
                checkInsertNotification += 1;
              }
            } catch (error) {
              console.log(error);
            }

            stringValueChidden = '';
            stringValueChidden = "(".concat(resultSap.HEADER.PR_NO, ",'").concat(userRl.rows[_index].userId, "','").concat(userRl.rows[_index].Release_Level, "')");

            if (lengX > Number(_index) + 1) {
              stringValueChidden += ',';
            }

            query_PR_RL_STRA += stringValueChidden;
          }

          if (!(checkInsertNotification > 1)) {
            _context.next = 43;
            break;
          }

          _context.next = 43;
          return regeneratorRuntime.awrap(db.query("".concat(stringValueNoti)));

        case 43:
          _context.next = 45;
          return regeneratorRuntime.awrap(db.query("".concat(query_PR_RL_STRA, ";")));

        case 45:
          return _context.abrupt("return", resultSap);

        case 46:
          _context.next = 51;
          break;

        case 48:
          _context.prev = 48;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", _context.t0);

        case 51:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 48]]);
};

module.exports = {
  updateTablePrAndRelease: updateTablePrAndRelease
};
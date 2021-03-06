"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // var sleep = require('sleep');


var db = require("../../../db/db");

var socIo = require("../../../../server");

var axios = require('axios'); // const apiSap = require("../../../apiSap/apiSap");
// const axios = require('axios')

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var updateTablePrAndRelease = function updateTablePrAndRelease(resultSap, req, dataCallSap, userId) {
  var notification, stringRelease, lengX, index, stringValueChidden, release_ID, rs, userRl, query_PR_RL_STRA, stringValueNoti, checkInsertNotification, dataPushNotificationMobile, _index, today, i, options, n, data, stringValueChidenNoti;

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
            _context.next = 19;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                        SET \"PR_SAP\"=".concat(resultSap.HEADER.PR_SAP, ", \"DESCRIPTION\"='").concat(dataCallSap.HEADER.DESCRIPTION, "', \"changeBy\"='").concat(userId, "',\"STATUS\"=5, \n                        \"StatusDescription\"='Complete', \"LOCAL_AMOUNT\"=").concat(resultSap.HEADER.LOCAL_AMOUNT, ", \n                        \"WAERS\"='").concat(resultSap.HEADER.WAERS ? resultSap.HEADER.WAERS : '', "', \"HWAERS\"='").concat(resultSap.HEADER.HWAERS ? resultSap.HEADER.HWAERS : '', "', \n                        \"changeAt\"=now(), \"Release_ID\"=''\n                        WHERE \"PR_NO\"=").concat(resultSap.HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\";")));

        case 11:
          rs = _context.sent;
          resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          resultSap.HEADER.createBy = rs.rows[0].createBy;
          resultSap.HEADER.changeAt = rs.rows[0].changeAt;
          resultSap.HEADER.STATUS = rs.rows[0].STATUS;
          return _context.abrupt("return", {
            code: 400,
            data: resultSap,
            message: 'not found Release_ID'
          });

        case 19:
          _context.next = 21;
          return regeneratorRuntime.awrap(db.query("select \"Release_Level\", \"userId\" from prm.\"Strategy\" WHERE \"Release_ID\" = '".concat(release_ID.rows[0].Release_ID, "' and \"ReleaseType\" = 'PR'")));

        case 21:
          userRl = _context.sent;
          lengX = userRl.rows.length;

          if (!(release_ID.rows.length === 0 || lengX === 0)) {
            _context.next = 36;
            break;
          }

          _context.next = 26;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                SET \"PR_SAP\"=".concat(resultSap.HEADER.PR_SAP, ", \"DESCRIPTION\"='").concat(dataCallSap.HEADER.DESCRIPTION, "', \"changeBy\"='").concat(userId, "',\"STATUS\"=5, \n                \"StatusDescription\"='Complete', \"LOCAL_AMOUNT\"=").concat(resultSap.HEADER.LOCAL_AMOUNT, ", \n                \"WAERS\"='").concat(resultSap.HEADER.WAERS ? resultSap.HEADER.WAERS : '', "', \"HWAERS\"='").concat(resultSap.HEADER.HWAERS ? resultSap.HEADER.HWAERS : '', "', \n                \"changeAt\"=now(), \"Release_ID\"=''\n                WHERE \"PR_NO\"=").concat(resultSap.HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\";")));

        case 26:
          rs = _context.sent;
          resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          resultSap.HEADER.createBy = rs.rows[0].createBy;
          resultSap.HEADER.changeAt = rs.rows[0].changeAt;
          resultSap.HEADER.STATUS = rs.rows[0].STATUS;
          return _context.abrupt("return", {
            code: 200,
            data: resultSap
          });

        case 36:
          _context.next = 38;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                SET \"PR_SAP\" = ".concat(resultSap.HEADER.PR_SAP, ",\"STATUS\"=2,\"LOCAL_AMOUNT\" = ").concat(resultSap.HEADER.LOCAL_AMOUNT, ",\n                \"Release_ID\"='").concat(release_ID.rows[0].Release_ID, "',\n                \"HWAERS\"='").concat(resultSap.HEADER.HWAERS, "'\n                WHERE \"PR_NO\"=").concat(resultSap.HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\"")));

        case 38:
          rs = _context.sent;
          resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          resultSap.HEADER.createBy = rs.rows[0].createBy;
          resultSap.HEADER.changeAt = rs.rows[0].changeAt;
          resultSap.HEADER.STATUS = rs.rows[0].STATUS; // var userRl = await db.query(`select "Release_Level", "userId" from prm."Strategy" WHERE "Release_ID" = '${release_ID.rows[0].Release_ID}' and "ReleaseType" = 'PR'`);
          // var lengX = userRl.rows.length;
          // if(isUpdateSubmit){

          _context.next = 47;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PR_RELEASE_STRATEGY\"\n                WHERE \"PR_NO\"=".concat(resultSap.HEADER.PR_NO, ";")));

        case 47:
          query_PR_RL_STRA = "INSERT INTO prm.\"PR_RELEASE_STRATEGY\" (\"PR_NO\",\"userId\",\"RELEASE_LEVEL\") VALUES";
          stringValueNoti = "INSERT INTO prm.\"Notification\"(\n                    \"forUserId\",\"FromUserId\",\"PR_NO\", \"StatusCode\", \"StatusDescription\", \"createAt\", \"changeAt\", \"NotiTypeDescription\", \"NotiType\")\n                    VALUES";
          checkInsertNotification = 1;
          _context.next = 52;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM prm.\"NotificationMobileKey\";"));

        case 52:
          dataPushNotificationMobile = _context.sent;
          _context.t0 = regeneratorRuntime.keys(userRl.rows);

        case 54:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 85;
            break;
          }

          _index = _context.t1.value;
          //push notification
          today = new Date();
          _context.prev = 57;

          if (!(Number(userRl.rows[_index].Release_Level) === 1)) {
            _context.next = 74;
            break;
          }

          for (i in notification.ioObject.listUSer) {
            if (notification.ioObject.listUSer[i].userId.toUpperCase() === userRl.rows[_index].userId.toUpperCase()) {
              notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("sendDataServer", {
                Content: null,
                createAt: today,
                changeAt: today,
                forUserId: userRl.rows[_index].userId.toUpperCase(),
                FromUserId: userId,
                NotiType: 3,
                NotiTypeDescription: 'Requires approval PR ',
                PR_NO: resultSap.HEADER.PR_NO,
                StatusCode: '',
                StatusDescription: 'pending'
              });
            }
          }

          options = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p"
            }
          };
          _context.t2 = regeneratorRuntime.keys(dataPushNotificationMobile.rows);

        case 62:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 70;
            break;
          }

          n = _context.t3.value;

          if (!(dataPushNotificationMobile.rows[n].userId === userRl.rows[_index].userId.toUpperCase())) {
            _context.next = 68;
            break;
          }

          data = {
            "registration_ids": ["".concat(dataPushNotificationMobile.rows[n].Token)],
            "notification": {
              "body": "".concat(userId, ": Requires approval PR  - ").concat(resultSap.HEADER.PR_NO),
              "PR_NO": resultSap.HEADER.PR_NO,
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
              "bodyText": resultSap.HEADER.PR_NO,
              "organization": "Elementary school"
            }
          }; // options.headers.Authorization = `key=${dataPushNotificationMobile.rows[n].Token}`;

          _context.next = 68;
          return regeneratorRuntime.awrap(axios.post('https://fcm.googleapis.com/fcm/send?', data, options).then(function (response) {// handle success
            // console.log(response);
          })["catch"](function (error) {// handle error
            // console.log(error);
          }).then(function () {// always executed
          }));

        case 68:
          _context.next = 62;
          break;

        case 70:
          //string for insert table notification
          stringValueChidenNoti = '';

          if (checkInsertNotification === 1) {
            stringValueChidenNoti = "('".concat(userRl.rows[_index].userId.toUpperCase(), "','").concat(userId, "','").concat(resultSap.HEADER.PR_NO, "', '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
          } else {
            stringValueChidenNoti = ",('".concat(userRl.rows[_index].userId.toUpperCase(), "','").concat(userId, "','").concat(resultSap.HEADER.PR_NO, "', '', 'pending', 'now()', 'now()', 'Approve Request', 3)");
          }

          stringValueNoti += stringValueChidenNoti;
          checkInsertNotification += 1;

        case 74:
          _context.next = 79;
          break;

        case 76:
          _context.prev = 76;
          _context.t4 = _context["catch"](57);
          console.log(_context.t4);

        case 79:
          stringValueChidden = '';
          stringValueChidden = "(".concat(resultSap.HEADER.PR_NO, ",'").concat(userRl.rows[_index].userId.toUpperCase(), "','").concat(userRl.rows[_index].Release_Level, "')");

          if (lengX > Number(_index) + 1) {
            stringValueChidden += ',';
          }

          query_PR_RL_STRA += stringValueChidden;
          _context.next = 54;
          break;

        case 85:
          if (!(checkInsertNotification > 1)) {
            _context.next = 88;
            break;
          }

          _context.next = 88;
          return regeneratorRuntime.awrap(db.query("".concat(stringValueNoti)));

        case 88:
          _context.next = 90;
          return regeneratorRuntime.awrap(db.query("".concat(query_PR_RL_STRA, ";")));

        case 90:
          return _context.abrupt("return", {
            code: 200,
            data: resultSap
          });

        case 91:
          _context.next = 96;
          break;

        case 93:
          _context.prev = 93;
          _context.t5 = _context["catch"](0);
          return _context.abrupt("return", _context.t5);

        case 96:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 93], [57, 76]]);
};

module.exports = {
  updateTablePrAndRelease: updateTablePrAndRelease
};
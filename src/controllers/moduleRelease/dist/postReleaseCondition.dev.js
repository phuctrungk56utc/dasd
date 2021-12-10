"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postReleaseCondition = function postReleaseCondition(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, queryInsert, listRelease, lengListRelease, queryInsertValue, leng, index, stringValueChiden, index2, stringValueChidenValue, _index;

  return regeneratorRuntime.async(function postReleaseCondition$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0].toUpperCase();
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"".concat(req.body.params.releaseType, "\"; ")));

        case 5:
          if (!(req.body.params.table.length === 0)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            message: 'Xóa thành công'
          }));

        case 7:
          queryInsert = "INSERT INTO prm.\"".concat(req.body.params.releaseType, "\"(\n                \"Release_ID\", \"Description\", \"createBy\", \"changeBy\", \"createdAt\", \"changeAt\",");
          _context.next = 10;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM prm.\"ModuleReleaseConditionType\" WHERE \"tableName\"='".concat(req.body.params.releaseType, "'")));

        case 10:
          listRelease = _context.sent;
          lengListRelease = listRelease.rows.length;
          queryInsertValue = '';
          leng = req.body.params.table.length;

          for (index in listRelease.rows) {
            stringValueChiden = void 0;
            stringValueChiden = "\"".concat(listRelease.rows[index].columnName, "_From\",\"").concat(listRelease.rows[index].columnName, "_To\"");

            if (lengListRelease > Number(index) + 1) {
              stringValueChiden += ',';
            }

            queryInsert += stringValueChiden;
          }

          queryInsert += ') VALUES'; //value

          for (index2 in req.body.params.table) {
            stringValueChidenValue = "('".concat(req.body.params.table[index2].Release_ID, "','").concat(req.body.params.table[index2].Description === undefined ? req.body.params.table[index2].Description : '', "','").concat(userId, "','").concat(userId, "','now()','now()',");

            for (_index in listRelease.rows) {
              eval("stringValueChidenValue += \"'".concat(req.body.params.table[index2]["".concat(listRelease.rows[_index].columnName, "_From")], "','").concat(req.body.params.table[index2]["".concat(listRelease.rows[_index].columnName, "_To")], "'\""));

              if (lengListRelease > Number(_index) + 1) {
                stringValueChidenValue += ',';
              }
            }

            stringValueChidenValue += ")";

            if (leng > Number(index2) + 1) {
              stringValueChidenValue += ',';
            }

            queryInsertValue += stringValueChidenValue;
          }

          queryInsert += queryInsertValue + ';'; // var queryInsert = `INSERT INTO prm."${req.body.params.releaseType}"(
          //     "Release_ID", "Description", "createdAt", "changeAt", "createBy", "changeBy", "FISTL_From", "FISTL_To", "FIPOS_From", "FIPOS_To", "LOCAL_AMOUNT_From", "LOCAL_AMOUNT_To")
          //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

          _context.next = 20;
          return regeneratorRuntime.awrap(db.query("".concat(queryInsert)));

        case 20:
          return _context.abrupt("return", res.status(200).json({
            message: 'Thành công'
          }));

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(401).json({
            message: _context.t0.message
          }));

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // }


module.exports = {
  postReleaseCondition: postReleaseCondition
};
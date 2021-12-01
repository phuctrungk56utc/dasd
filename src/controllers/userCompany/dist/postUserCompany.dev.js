"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postUserCompany = function postUserCompany(req, res) {
  var queryRoot, lengthList, i, element, queryInsert, _i;

  return regeneratorRuntime.async(function postUserCompany$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          queryRoot = "DELETE FROM prm.\"userCompany\" WHERE \"userId\" IN (";
          lengthList = req.body.params.params.list.length;

          for (i in req.body.params.params.list) {
            element = '';

            if (lengthList === Number(i) + 1) {
              element = "'".concat(req.body.params.params.list[i], "'");
            } else {
              element = "'".concat(req.body.params.params.list[i], "',");
            }

            queryRoot += element;
          }

          queryRoot += ');';
          _context.next = 7;
          return regeneratorRuntime.awrap(db.query("".concat(queryRoot)));

        case 7:
          if (!(req.body.params.params.data.length > 0)) {
            _context.next = 14;
            break;
          }

          queryInsert = "INSERT INTO prm.\"userCompany\"(\n                \"BUKRS\", \"userId\")\n                VALUES";
          lengthList = req.body.params.params.data.length;

          for (_i in req.body.params.params.data) {
            element = '';

            if (lengthList === Number(_i) + 1) {
              element = "('".concat(req.body.params.params.data[_i].BUKRS, "','").concat(req.body.params.params.data[_i].userId, "')");
            } else {
              element = "('".concat(req.body.params.params.data[_i].BUKRS, "','").concat(req.body.params.params.data[_i].userId, "'),");
            }

            queryInsert += element;
          }

          queryInsert += ';';
          _context.next = 14;
          return regeneratorRuntime.awrap(db.query("".concat(queryInsert)));

        case 14:
          return _context.abrupt("return", res.status(200).json({
            message: 'success'
          }));

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            message: _context.t0
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

module.exports = {
  postUserCompany: postUserCompany
};
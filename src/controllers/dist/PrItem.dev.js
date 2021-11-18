"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var PrItem = function PrItem(req, res) {
  var para, query;
  return regeneratorRuntime.async(function PrItem$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // await sleep.sleep(1);
          para = req.query.PR_NO;

          if (para) {
            query = "SELECT * FROM prm.\"PrItem\" \n        WHERE \"PR_NO\"=".concat(para);
          } else {
            query = "SELECT * FROM prm.\"PrItem\"";
          } // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {


          db.query(query, function (err, resp) {
            if (err) {
              return res.status(404).json({
                database: err
              });
            } else {
              return res.status(200).json({
                item: resp.rows
              });
            }
          });
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            database: _context.t0
          }));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

module.exports = {
  PrItem: PrItem
};
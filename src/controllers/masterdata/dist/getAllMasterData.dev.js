"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getAllMasterData = function getAllMasterData(req, res) {
  var size, query;
  return regeneratorRuntime.async(function getAllMasterData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          Object.size = function (obj) {
            var size = 0,
                key;

            for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
            }

            return size;
          };

          size = Object.size(req.query);

          if (String(req.query[Object.keys(req.query)[0]]) === '*') {
            query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], ";");
          } else {
            if (String(req.query[Object.keys(req.query)[0]]).length === 1) {
              query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], "\n\t\t\tWHERE ").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toLowerCase(), "%' OR \n\t\t\t").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toUpperCase(), "%' OR\n\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toLowerCase(), "%' OR \n\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toUpperCase(), "%';");
            } else {
              query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], "\n\t\t\t\tWHERE ").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]), "%' OR\n\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]), "%';");
            }
          }

          db.query(query, function (err, resp) {
            if (err) {
              return res.status(404).json({
                message: err.message
              });
            } else {
              return res.status(200).json(resp.rows);
            }
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  getAllMasterData: getAllMasterData
};
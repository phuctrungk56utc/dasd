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


var deletePr = function deletePr(req, res) {
  return regeneratorRuntime.async(function deletePr$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrTable\"\n        WHERE \"PR_NO\" = ".concat(req.body.params.PR_NO, ";")));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n        WHERE \"PR_NO\" = ".concat(req.body.params.PR_NO, ";")));

        case 5:
          _context.next = 9;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  deletePr: deletePr
};
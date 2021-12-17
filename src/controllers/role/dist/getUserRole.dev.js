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
//for table


var getUserRole = function getUserRole(req, res) {
  return regeneratorRuntime.async(function getUserRole$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // await sleep.sleep(1);
          db.query("SELECT * FROM prm.\"userRole\"\n    ORDER BY \"userId\" ASC ", function (err, resp) {
            if (err) {
              return res.status(500).json({
                message: err
              });
            } else {
              return res.status(200).json({
                item: resp.rows
              });
            }
          });
          _context.next = 7;
          break;

        case 4:
          _context.prev = 4;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            message: _context.t0
          }));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

module.exports = {
  getUserRole: getUserRole
};
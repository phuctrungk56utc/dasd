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


var getNotification = function getNotification(req, res) {
  return regeneratorRuntime.async(function getNotification$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            query = "SELECT * FROM prm.\"Notification\" \n\t\tWHERE \"forUserId\" = '".concat(req.query.userId, "'  ORDER BY \"changeAt\" ASC;"); //WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`

            db.query(query, function (err, resp) {
              if (err) {
                return res.status(404).json({
                  message: err.message
                });
              } else {
                return res.status(200).json(resp.rows);
              }
            });
          } catch (error) {}

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  getNotification: getNotification
};
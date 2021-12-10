"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
var crypt = require("../../crypt/crypt");

require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var decodeJWT = require('jwt-decode');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getNotification = function getNotification(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk;
  return regeneratorRuntime.async(function getNotification$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            userId = '';

            try {
              token = req.headers.authorization.split(' ')[1];
              basicAuth = Buffer.from(token, 'base64').toString('ascii');
              userId = basicAuth.split(':')[0].toUpperCase();
            } catch (error) {
              accessToken = crypt.decrypt(req.headers.authorization);
              decodeTk = decodeJWT(accessToken);
              userId = decodeTk.userId.toUpperCase();
            }

            query = "SELECT * FROM prm.\"Notification\" \n\t\tWHERE \"forUserId\" = '".concat(userId, "'  ORDER BY \"createAt\" DESC;"); //WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`

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
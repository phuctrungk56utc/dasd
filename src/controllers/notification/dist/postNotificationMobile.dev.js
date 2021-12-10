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


var postNotificationMobile = function postNotificationMobile(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, query;
  return regeneratorRuntime.async(function postNotificationMobile$(_context) {
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
            userId = decodeTk.userId.toUpperCase();
          }

          query = "INSERT INTO prm.\"NotificationMobileKey\" (\"userId\",\"Token\")  \n\t\tselect \n\t\tunnest(array['".concat(userId, "']::character varying[]) as \"userId\",\n\t\tunnest(array['").concat(req.body.params.token, "']::text[]) as \"Token\"\n\t\tON CONFLICT (\"Token\") DO UPDATE \n\t\t  SET \n\t\t  \"Token\" = EXCLUDED.\"Token\",\n\t\t\t\"userId\" = EXCLUDED.\"userId\";"); //WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`

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
  postNotificationMobile: postNotificationMobile
};
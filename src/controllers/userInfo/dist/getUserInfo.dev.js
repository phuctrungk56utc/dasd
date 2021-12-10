"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
var crypt = require("../../crypt/crypt");

require('dotenv').config();

var decodeJWT = require('jwt-decode');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getUserInfo = function getUserInfo(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk;
  return regeneratorRuntime.async(function getUserInfo$(_context) {
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

          db.query("SELECT * FROM prm.\"userInfo\" where \"userId\" = '".concat(userId, "';"), function (err, resp) {
            if (err) {
              return res.status(500).json({
                database: err
              });
            } else {
              return res.status(200).json({
                item: resp.rows,
                userId: userId
              });
            }
          });
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
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
  getUserInfo: getUserInfo
};
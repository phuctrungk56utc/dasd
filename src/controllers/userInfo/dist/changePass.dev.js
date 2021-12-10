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


var changePass = function changePass(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, getPass, pass, passNew;
  return regeneratorRuntime.async(function changePass$(_context) {
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

          _context.next = 5;
          return regeneratorRuntime.awrap(db.query("select * from prm.users where \"userId\"='".concat(userId, "';")));

        case 5:
          getPass = _context.sent;
          pass = crypt.decrypt(getPass.rows[0].password);

          if (!(req.body.params.PassOld === pass && req.body.params.PassNew === req.body.params.PassReNew)) {
            _context.next = 12;
            break;
          }

          passNew = crypt.encrypt(req.body.params.PassNew);
          db.query("UPDATE prm.users\n        SET \"refreshToken\"='', password='".concat(passNew, "', \"changeBy\"='").concat(userId, "',\"changeAt\"=now()\n        WHERE \"userId\"='").concat(userId, "';"), function (err, resp) {
            if (err) {
              return res.status(200).json({
                message: 'error'
              });
            } else {
              return res.status(200).json({
                message: 'success'
              });
            }
          });
          _context.next = 13;
          break;

        case 12:
          return _context.abrupt("return", res.status(200).json({
            message: 'Password is incorrect'
          }));

        case 13:
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: 'error'
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = {
  changePass: changePass
};
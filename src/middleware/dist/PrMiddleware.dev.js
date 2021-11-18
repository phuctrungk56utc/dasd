"use strict";

/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/auth.js
 */
var jwtHelper = require("../helpers/jwt.helper");

var debug = console.log.bind(console);

var db = require("../db/db");

var crypt = require("../crypt/crypt");

var jwt = require("jsonwebtoken"); // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file


var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-trungquandev.com-green-cat-a@";
var accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res
 * @param {*} next 
 */

var isPrData = function isPrData(req, res, next) {
  var token, basicAuth, accessToken;
  return regeneratorRuntime.async(function isPrData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.headers.authorization.split(' ')[1] ? req.headers.authorization.split(' ')[1] : req.headers.authorization;

          if (!req.headers.authorization.split(' ')[1]) {
            _context.next = 13;
            break;
          }

          basicAuth = Buffer.from(token, 'base64').toString('ascii'); // console.log(Buffer.from(token, 'base64').toString('ascii'));
          // console.log(basicAuth.split(':')[0])
          // console.log(basicAuth.split(':')[1])

          _context.prev = 4;
          db.query("SELECT * FROM prm.users users WHERE \"users\".\"userId\" = '".concat(basicAuth.split(':')[0].toUpperCase(), "'"), function (err, resp) {
            if (err) {
              return res.status(500).json({
                err: err
              });
            } else {
              if (resp.rows.length > 0 && crypt.encrypt(String(basicAuth.split(':')[1])) === resp.rows[0].password) {
                // return res.status(200).json({ data: resp.rows[0].userId });
                next();
              } else {
                return res.status(404).json({
                  error: 'Authentication error'
                });
              }
            }
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](4);
          return _context.abrupt("return", res.status(404).json({
            error: _context.t0
          }));

        case 11:
          _context.next = 14;
          break;

        case 13:
          try {
            accessToken = crypt.decrypt(token);
            jwt.verify(accessToken, accessTokenSecretAccess, function (error, decoded) {
              if (error) {
                next(); // return res.status(404).json({ error,message:'session expires' });
              } else {
                next();
              }
            });
          } catch (error) {
            next(); // return res.status(500).json({ error });
          }

        case 14:
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t1 = _context["catch"](0);
          return _context.abrupt("return", res.status(403).json({
            error: 'Authentication error'
          }));

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16], [4, 8]]);
};

module.exports = {
  isPrData: isPrData
};
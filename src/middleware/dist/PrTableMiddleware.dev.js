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
          token = req.headers.authorization.split(' ')[1] ? req.headers.authorization.split(' ')[1] : req.headers.authorization;

          if (!req.headers.authorization.split(' ')[1]) {
            _context.next = 6;
            break;
          }

          basicAuth = Buffer.from(token, 'base64').toString('ascii'); // console.log(Buffer.from(token, 'base64').toString('ascii'));
          // console.log(basicAuth.split(':')[0])
          // console.log(basicAuth.split(':')[1])

          try {
            db.query("SELECT * FROM prm.users users WHERE \"users\".\"userId\" = '".concat(basicAuth.split(':')[0], "'"), function (err, resp) {
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
                    err: err
                  });
                }
              }
            });
          } catch (error) {}

          _context.next = 14;
          break;

        case 6:
          _context.prev = 6;
          accessToken = crypt.decrypt(token);
          jwt.verify(accessToken, accessTokenSecretAccess, function (error, decoded) {
            if (error) {
              return res.status(404).json({
                error: error,
                message: 'session expires'
              });
            } else {
              next();
            }
          });
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](6);
          return _context.abrupt("return", res.status(500).json({
            error: _context.t0
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 11]]);
};

module.exports = {
  isPrData: isPrData
};
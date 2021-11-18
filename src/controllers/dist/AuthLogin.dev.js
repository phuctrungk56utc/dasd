"use strict";

var jwtHelper = require("../helpers/jwt.helper");

var debug = console.log.bind(console);

var crypt = require("../crypt/crypt");

require('dotenv').config();

var jwt = require("jsonwebtoken");

var sleep = require('sleep'); // Thời gian sống của token


var accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "30s"; // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file

var accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
var accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH; // Thời gian sống của refreshToken

var refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "15d"; // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file

var refreshTokenSecret = process.env.CIBER_PRM_JWT;

var db = require("../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var authLogin = function authLogin(req, res) {
  return regeneratorRuntime.async(function authLogin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // await sleep.sleep(1);
          db.query("SELECT * FROM prm.users users WHERE \"users\".\"userId\" = '".concat(req.body.userId.toUpperCase(), "'"), function (err, resp) {
            // const ciphertext = crypt.encrypt(String(req.body.password));
            try {
              // var roleData = null
              if (req.body.userId.toUpperCase() === resp.rows[0].userId && crypt.encrypt(String(req.body.password)) === resp.rows[0].password) {
                var DbAccessTK = jwt.sign({
                  "userId": resp.rows[0].userId,
                  key: process.env.CIBER_PRM_KEY_PRIVATE //role: resp.rows//{ functionAll: true, functionView: null, functionCreateEditDelete: null, functionAdmin: null },

                }, accessTokenSecretAccess, {
                  expiresIn: accessTokenLife
                });
                var DbRefreshTK = jwt.sign({
                  userId: resp.rows[0].userId.toUpperCase() // key: process.env.CIBER_PRM_KEY_PRIVATE,
                  // role: { functionAll: true, functionView: null, functionCreateEditDelete: null, functionAdmin: null },

                }, accessTokenSecretRefresh, {
                  expiresIn: refreshTokenLife
                });
                var accessToken = crypt.encrypt(DbAccessTK);
                var refreshToken = crypt.encrypt(DbRefreshTK); //update to database
                // roleData = resp.rows;

                db.query("UPDATE prm.users\n          SET \"refreshToken\"='".concat(refreshToken, "' WHERE \"userId\" = '").concat(req.body.userId, "'"), function (err, resp) {
                  if (err) {
                    return res.status(500).json({
                      database: err
                    });
                  }

                  return res.status(200).json({
                    accessToken: accessToken
                  });
                });
              } else {
                return res.status(404).json({
                  error: 'Password is incorrect'
                });
              }
            } catch (error) {
              return res.status(404).json({
                error: 'user not found'
              });
            }
          });
          _context.next = 7;
          break;

        case 4:
          _context.prev = 4;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json(_context.t0));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

var auThRefresh = function auThRefresh(req, res) {
  return regeneratorRuntime.async(function auThRefresh$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          db.query("SELECT * FROM prm.roles WHERE \"userId\" = '".concat(decodeTk.userId, "'\n  ORDER BY \"roleId\" ASC"), function (err, resp) {
            if (err) {
              return res.status(500).json({
                database: err
              });
            } else {
              return res.status(200).json({
                roles: resp.rows
              });
            }
          }); // return res.status(200).json({toKent:'Success'});

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  authLogin: authLogin,
  auThRefresh: auThRefresh
};
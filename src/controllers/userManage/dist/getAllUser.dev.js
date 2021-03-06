"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");
// var sleep = require('sleep');
// Thời gian sống của token
// const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "30s";
// // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
// const accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
// const accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH;
// // Thời gian sống của refreshToken
// const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "15d";
// // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
// const refreshTokenSecret = process.env.CIBER_PRM_JWT;


var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getUser = function getUser(req, res) {
  return regeneratorRuntime.async(function getUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // await sleep.sleep(1);
          db.query("SELECT * FROM prm.\"userInfo\"\n    ORDER BY \"userId\" ASC ", function (err, resp) {
            if (err) {
              return res.status(500).json({
                database: err
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
            database: _context.t0
          }));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

module.exports = {
  getUser: getUser
};
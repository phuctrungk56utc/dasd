"use strict";

var jwtHelper = require("../helpers/jwt.helper");

var debug = console.log.bind(console);

var crypt = require("../crypt/crypt");

require('dotenv').config();

var decodeJWT = require('jwt-decode');

var jwt = require("jsonwebtoken");

var sleep = require('sleep'); // Thời gian sống của token


var accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "30s"; // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file

var accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
var accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH; // Thời gian sống của refreshToken

var refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "15d"; // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file

var refreshTokenSecret = process.env.CIBER_PRM_JWT;

var db = require("../db/db"); // const socIo = require("../../server");

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var user = {
  date: 'yeu e'
};

var PrTable = function PrTable(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk;
  return regeneratorRuntime.async(function PrTable$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0];
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId.toUpperCase();
          } // await sleep.sleep(1);
          // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {


          db.query("SELECT * FROM prm.\"PrTable\" WHERE \"createBy\"='".concat(userId, "'\n    ORDER BY \"changeAt\" DESC; "), function (err, resp) {
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
  PrTable: PrTable
};
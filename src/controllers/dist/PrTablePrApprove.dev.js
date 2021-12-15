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

var db = require("../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var PrTablePrApprove = function PrTablePrApprove(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, query, now, prevMonthLastDate, prevMonthFirstDate, formatDateComponent, formatDate;
  return regeneratorRuntime.async(function PrTablePrApprove$(_context) {
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
          } // await sleep.sleep(1);
          // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {


          query = '';
          now = new Date("".concat(req.query.yearQuery), "".concat(req.query.monthQuery), '01');
          prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
          prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);

          formatDateComponent = function formatDateComponent(dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
          };

          formatDate = function formatDate(date) {
            return formatDateComponent(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()));
          };

          if (req.query && req.query.type) {
            if (req.query.type === 'All') {
              query = "SELECT * FROM prm.\"PrTable\" pr INNER JOIN prm.\"PR_RELEASE_STRATEGY\" rl ON pr.\"PR_NO\" = rl.\"PR_NO\" WHERE (pr.\"PR_SAP\" <> 0\n        and rl.\"userId\" = '".concat(userId.toUpperCase(), "' or rl.\"userId\" = '").concat(userId.toLowerCase(), "') and \n        ( pr.\"changeAt\" BETWEEN '").concat(formatDate(prevMonthFirstDate), " 00:00:00' AND '").concat(formatDate(prevMonthLastDate), " 23:59:59' )\n        and\n        ( rl.\"changeAt\" BETWEEN '").concat(formatDate(prevMonthFirstDate), " 00:00:00' AND '").concat(formatDate(prevMonthLastDate), " 23:59:59' )\n            ORDER BY pr.\"changeAt\" DESC\n            ;");
            } else {
              query = "SELECT * FROM prm.\"PrTable\" pr INNER JOIN prm.\"PR_RELEASE_STRATEGY\" rl ON pr.\"PR_NO\" = rl.\"PR_NO\" WHERE (pr.\"PR_SAP\" <> 0\n        and rl.\"userId\" = '".concat(userId.toUpperCase(), "' or rl.\"userId\" = '").concat(userId.toLowerCase(), "') and \n        ( pr.\"changeAt\" BETWEEN '").concat(formatDate(prevMonthFirstDate), " 00:00:00' AND '").concat(formatDate(prevMonthLastDate), " 23:59:59' )\n        and\n        ( rl.\"changeAt\" BETWEEN '").concat(formatDate(prevMonthFirstDate), " 00:00:00' AND '").concat(formatDate(prevMonthLastDate), " 23:59:59' )\n        and ( pr.\"STATUS\"=").concat(Number(req.query.statusCode), " )\n            ORDER BY pr.\"changeAt\" DESC\n        ;");
            }
          } else {
            query = "SELECT * FROM prm.\"PrTable\" pr INNER JOIN prm.\"PR_RELEASE_STRATEGY\" rl ON pr.\"PR_NO\" = rl.\"PR_NO\" WHERE pr.\"PR_SAP\" <> 0\n    and rl.\"userId\" = '".concat(userId.toUpperCase(), "' or rl.\"userId\" = '").concat(userId.toLowerCase(), "'\n        ORDER BY pr.\"changeAt\" DESC\n        ;");
          }

          db.query(query, function (err, resp) {
            if (err) {
              return res.status(500).json({
                database: err
              });
            } else {
              // console.log('object')
              return res.status(200).json({
                item: resp.rows
              });
            }
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            database: _context.t0
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  PrTablePrApprove: PrTablePrApprove
};
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
  var userId, token, basicAuth, accessToken, decodeTk, query, now, prevMonthLastDate, prevMonthFirstDate, formatDateComponent, formatDate;
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
              if (req.query.type !== 'All') {
                query = "SELECT * FROM prm.\"Notification\" \n\t\t\t\tWHERE \"forUserId\" = '".concat(userId, "' and \"NotiType\" = ").concat(req.query.statusCode, " and\n\t\t\t\t( \"changeAt\" BETWEEN '").concat(formatDate(prevMonthFirstDate), " 00:00:00' AND '").concat(formatDate(prevMonthLastDate), " 23:59:59' )\n\t\t\t\tORDER BY \"createAt\" DESC;");
              } else {
                query = "SELECT * FROM prm.\"Notification\"\n\t\t\t\tWHERE \"forUserId\" = '".concat(userId, "' and\n\t\t\t\t( \"changeAt\" BETWEEN '").concat(formatDate(prevMonthFirstDate), " 00:00:00' AND '").concat(formatDate(prevMonthLastDate), " 23:59:59' )\n\t\t\t\t ORDER BY \"createAt\" DESC;");
              }
            } else {
              query = "SELECT * FROM prm.\"Notification\"\n\t\t\tWHERE \"forUserId\" = '".concat(userId, "'\n\t\t\t ORDER BY \"createAt\" DESC;");
            } //WHERE "forUserId" = '${req.query.userId}' and "StatusCode" != 'X' ORDER BY "changeAt" DESC;`


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
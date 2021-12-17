"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode');

require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getAllMasterData = function getAllMasterData(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, size, query, userConpany, listCompanyString, index, stringValueChiden;
  return regeneratorRuntime.async(function getAllMasterData$(_context) {
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

          Object.size = function (obj) {
            var size = 0,
                key;

            for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
            }

            return size;
          };

          size = Object.size(req.query);
          _context.next = 7;
          return regeneratorRuntime.awrap(db.query("SELECT \"BUKRS\" FROM prm.\"userCompany\"\n\t\twhere \"userId\"='".concat(userId, "'")));

        case 7:
          userConpany = _context.sent;
          listCompanyString = "[";
          lengthUserCompany = userConpany.rows.length;

          if (lengthUserCompany > 0) {
            for (index in userConpany.rows) {
              stringValueChiden = "";
              stringValueChiden = "'".concat(userConpany.rows[index].BUKRS, "'");

              if (lengthUserCompany > Number(index) + 1) {
                stringValueChiden += ',';
              }

              listCompanyString += stringValueChiden;
            }

            listCompanyString += "]";
          } else {
            listCompanyString = "['']";
          }

          if (Object.keys(req.query)[0] === '"WERKS"' || Object.keys(req.query)[0] === '"BUKRS"' && !(req.query && req.query.query === 'All')) {
            if (String(req.query[Object.keys(req.query)[0]]) === '*') {
              query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], " WHERE \"BUKRS\" = ANY(ARRAY").concat(listCompanyString, ");");
            } else {
              if (String(req.query[Object.keys(req.query)[0]]).length === 1) {
                query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], "\n\t\t\t\tWHERE ( ").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toLowerCase(), "%' OR \n\t\t\t\t").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toUpperCase(), "%' OR\n\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toLowerCase(), "%' OR \n\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toUpperCase(), "%' ) and \"BUKRS\" = ANY(ARRAY").concat(listCompanyString, ");");
              } else {
                query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], "\n\t\t\t\t\tWHERE ( ").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]), "%' OR\n\t\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]), "%' ) and \"BUKRS\" = ANY(ARRAY").concat(listCompanyString, ");");
              }
            }
          } else {
            if (String(req.query[Object.keys(req.query)[0]]) === '*') {
              query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], ";");
            } else {
              if (String(req.query[Object.keys(req.query)[0]]).length === 1) {
                query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], "\n\t\t\t\tWHERE ( ").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toLowerCase(), "%' OR \n\t\t\t\t").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toUpperCase(), "%' OR\n\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toLowerCase(), "%' OR \n\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]).toUpperCase(), "%' );");
              } else {
                query = "SELECT * FROM prm.".concat(Object.keys(req.query)[0], "\n\t\t\t\t\tWHERE ( ").concat(Object.keys(req.query)[0], " LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]), "%' OR\n\t\t\t\t\t\"DESCRIPTION\" LIKE '%").concat(String(req.query[Object.keys(req.query)[0]]), "%' );");
              }
            }
          }

          db.query(query, function (err, resp) {
            if (err) {
              return res.status(404).json({
                message: 'Syntax error'
              });
            } else {
              return res.status(200).json(resp.rows);
            }
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = {
  getAllMasterData: getAllMasterData
};
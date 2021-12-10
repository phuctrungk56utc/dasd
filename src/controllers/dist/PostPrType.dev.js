"use strict";

var jwtHelper = require("../helpers/jwt.helper");

var debug = console.log.bind(console);

var crypt = require("../crypt/crypt");

require('dotenv').config();

var decodeJWT = require('jwt-decode');

var db = require("../db/db"); // const socIo = require("../../server");

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var PostPrType = function PostPrType(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, valueCode, valueName, valueTime, valueUsers, index, query;
  return regeneratorRuntime.async(function PostPrType$(_context) {
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

          valueCode = [];
          valueName = [];
          valueTime = [];
          valueUsers = [];

          for (index in req.body.params.tablePrType) {
            valueCode.push(req.body.params.tablePrType[index].PR_TYPE);

            if (req.body.params.tablePrType[index].Description) {
              valueName.push(req.body.params.tablePrType[index].Description);
            } else {
              valueName.push('');
            }

            valueTime.push('now()');
            valueUsers.push(userId);
          }

          db.query("DELETE FROM prm.\"PrType\";");
          query = "INSERT INTO prm.\"PrType\" (\"PR_TYPE\", \"Description\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\") \n      select  \n      unnest($1::character varying[]) as \"PR_TYPE\",\n      unnest($2::text[]) as \"Description\",\n      unnest($3::timestamp[]) as \"createdAt\",\n      unnest($4::timestamp[]) as \"changeAt\",\n      unnest($5::character varying[]) as \"createBy\",\n      unnest($6::character varying[]) as \"changeBy\"\n      ON CONFLICT (\"PR_TYPE\") DO UPDATE \n        SET \"PR_TYPE\" = EXCLUDED.\"PR_TYPE\",\n        \"Description\" = EXCLUDED.\"Description\",\n          \"changeAt\"=EXCLUDED.\"changeAt\",\n          \"createBy\"=EXCLUDED.\"createBy\";";
          db.query(query, [valueCode, valueName, valueTime, valueTime, valueUsers, valueUsers], function (err, resp) {
            if (err) {
              return res.status(404).json({
                message: err.message
              });
            } else {
              return res.status(200).json({
                status: 'Success'
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
  PostPrType: PostPrType
};
"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postCompanyCode = function postCompanyCode(req, res) {
  var token, basicAuth, valueCode, valueName, valueLvorm, valueTime, valueUsers, value, query;
  return regeneratorRuntime.async(function postCompanyCode$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // const para = req.query.bukrs;
          token = req.headers.authorization.split(' ')[1];
          basicAuth = Buffer.from(token, 'base64').toString('ascii');
          valueCode = [];
          valueName = [];
          valueLvorm = [];
          valueTime = [];
          valueUsers = [];

          for (value in req.body) {
            valueCode.push(req.body[value].bukrs);
            valueName.push(req.body[value].butxt);
            valueLvorm.push(req.body[value].lvorm);
            valueTime.push('now()');
            valueUsers.push(basicAuth.split(':')[0].toUpperCase());
          }

          query = "INSERT INTO prm.\"CompanyCode\" (bukrs, butxt, lvorm,\"createdAt\",\"changeAt\",\"createBy\",\"changeBy\") \n    select  \n    unnest($1::character varying[]) as bukrs,\n    unnest($2::text[]) as butxt,\n    unnest($3::char[]) as lvorm,\n    unnest($4::timestamp[]) as \"createdAt\",\n    unnest($5::timestamp[]) as \"changeAt\",\n    unnest($6::character varying[]) as \"createBy\",\n    unnest($7::character varying[]) as \"changeBy\"\n    ON CONFLICT (bukrs) DO UPDATE \n      SET butxt = EXCLUDED.butxt,\n        lvorm = EXCLUDED.lvorm,\n        \"changeAt\"=EXCLUDED.\"changeAt\",\n        \"createBy\"=EXCLUDED.\"createBy\";";
          db.query(query, [valueCode, valueName, valueLvorm, valueTime, valueTime, valueUsers, valueUsers], function (err, resp) {
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
            message: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  postCompanyCode: postCompanyCode
};
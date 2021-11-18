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


var postMasterData = function postMasterData(req, res) {
  var fieldName, fieldForPlan, checkFieldNoPlant, token, basicAuth, valueCode, valueName, valueTime, valueUsers, BUKRS, value, query, _token, _basicAuth, _value;

  return regeneratorRuntime.async(function postMasterData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          Object.size = function (obj) {
            var size = 0,
                key;

            for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
            }

            return size;
          }; // var size = Object.size(req.query);


          fieldName = '';
          fieldForPlan = '';
          checkFieldNoPlant = false;
          _context.prev = 5;

          if (!(Object.keys(req.body[0])[2] !== undefined)) {
            _context.next = 11;
            break;
          }

          fieldForPlan = "BUKRS";
          fieldName = "WERKS";
          _context.next = 12;
          break;

        case 11:
          throw 'Field fail';

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](5);

          if (Object.keys(req.body[0])[0].toUpperCase() === 'DESCRIPTION') {
            fieldName = Object.keys(req.body[0])[1].toUpperCase();
            checkFieldNoPlant = true;
          } else {
            fieldName = Object.keys(req.body[0])[0].toUpperCase();
          }

        case 17:
          if (fieldForPlan === "BUKRS") {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii').split(':')[0].toUpperCase();
            valueCode = [];
            valueName = [];
            valueTime = [];
            valueUsers = [];
            BUKRS = [];

            for (value in req.body) {
              eval("valueCode.push(req.body[value]['".concat(fieldName, "']);"));
              valueName.push(req.body[value].DESCRIPTION !== undefined ? req.body[value].DESCRIPTION : req.body[value].DESCRIPTION);
              BUKRS.push(req.body[value].BUKRS);
              valueTime.push('now()');
              valueUsers.push(basicAuth);
            }

            query = "INSERT INTO prm.\"".concat(fieldName.toUpperCase(), "\" (\"").concat(fieldName.toUpperCase(), "\",\"BUKRS\", \"DESCRIPTION\",\"createdAt\",\"changeAt\",\"createBy\",\"changeBy\") \n          select  \n          unnest($1::character varying[]) as \"").concat(fieldName.toUpperCase(), "\",\n          unnest($2::character varying[]) as \"BUKRS\",\n          unnest($3::text[]) as \"DESCRIPTION\",\n\n          unnest($4::timestamp[]) as \"createdAt\",\n          unnest($5::timestamp[]) as \"changeAt\",\n          unnest($6::character varying[]) as \"createBy\",\n          unnest($7::character varying[]) as \"changeBy\"\n  \n          ON CONFLICT (\"").concat(fieldName.toUpperCase(), "\") DO UPDATE \n            SET \n            \"BUKRS\" = EXCLUDED.\"BUKRS\",\n            \"DESCRIPTION\" = EXCLUDED.\"DESCRIPTION\",\n            \"changeAt\"=EXCLUDED.\"changeAt\",\n            \"createBy\"=EXCLUDED.\"createBy\";");
            db.query(query, [valueCode, BUKRS, valueName, valueTime, valueTime, valueUsers, valueUsers], function (err, resp) {
              if (err) {
                return res.status(404).json({
                  message: err.message
                });
              } else {
                return res.status(200).json({
                  message: 'Success'
                });
              }
            });
          } else {
            _token = req.headers.authorization.split(' ')[1];
            _basicAuth = Buffer.from(_token, 'base64').toString('ascii').split(':')[0].toUpperCase();
            valueCode = [];
            valueName = [];
            valueTime = [];
            valueUsers = [];

            for (_value in req.body) {
              if (checkFieldNoPlant) {
                eval("valueCode.push(req.body[value]['".concat(Object.keys(req.body[0])[1], "']);"));
                eval("valueName.push(req.body[value]['".concat(Object.keys(req.body[0])[0], "']);")); // valueName.push(req.body[value].Description && req.body[value].Description);
              } else {
                eval("valueCode.push(req.body[value]['".concat(Object.keys(req.body[0])[0], "']);"));
                eval("valueName.push(req.body[value]['".concat(Object.keys(req.body[0])[1], "']);")); // valueName.push(req.body[value].Description && req.body[value].Description);
              }

              valueTime.push('now()');
              valueUsers.push(_basicAuth);
            }

            query = "INSERT INTO prm.\"".concat(fieldName.toUpperCase(), "\" (\"").concat(fieldName.toUpperCase(), "\", \"DESCRIPTION\",\"createdAt\",\"changeAt\",\"createBy\",\"changeBy\") \n        select  \n        unnest($1::character varying[]) as \"").concat(fieldName.toUpperCase(), "\",\n        unnest($2::text[]) as \"DESCRIPTION\",\n\n        unnest($3::timestamp[]) as \"createdAt\",\n        unnest($4::timestamp[]) as \"changeAt\",\n        unnest($5::character varying[]) as \"createBy\",\n        unnest($6::character varying[]) as \"changeBy\"\n\n        ON CONFLICT (\"").concat(fieldName.toUpperCase(), "\") DO UPDATE \n          SET \"DESCRIPTION\" = EXCLUDED.\"DESCRIPTION\",\n            \"changeAt\"=EXCLUDED.\"changeAt\",\n            \"createBy\"=EXCLUDED.\"createBy\";");
            db.query(query, [valueCode, valueName, valueTime, valueTime, valueUsers, valueUsers], function (err, resp) {
              if (err) {
                return res.status(404).json({
                  message: err.message
                });
              } else {
                return res.status(200).json({
                  message: 'Success'
                });
              }
            });
          }

          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t1 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: err.message
          }));

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20], [5, 14]]);
};

module.exports = {
  postMasterData: postMasterData
};
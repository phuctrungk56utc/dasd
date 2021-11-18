"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postModuleRelease = function postModuleRelease(req, res) {
  var getResults;
  return regeneratorRuntime.async(function postModuleRelease$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          getResults = function _ref() {
            var userId, token, basicAuth, accessToken, decodeTk, queryMany, valueCode, valueName, valueTime, valueUsers, dataRq, value, query, rsInsertTable;
            return regeneratorRuntime.async(function getResults$(_context) {
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
                      userId = decodeTk.userId;
                    }

                    queryMany = "";
                    valueCode = [];
                    valueName = [];
                    valueTime = [];
                    valueUsers = [];
                    dataRq = req.body.params.data || req.body;

                    for (value in dataRq) {
                      valueCode.push(dataRq[value].NameType.toUpperCase());
                      valueName.push(dataRq[value].Description);
                      valueTime.push('now()');
                      valueUsers.push(userId);
                      queryMany = queryMany.concat("create table prm.\"".concat(dataRq[value].NameType.toUpperCase(), "\" ( \"createdAt\" timestamp default now(), \"changeAt\" timestamp default now(), \"createBy\" character varying(10),\"changeBy\" character varying(10));"));
                    }

                    query = "INSERT INTO prm.\"ModuleRelease\" (\"NameType\", \"Description\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\")  \n            select \n            unnest($1::character varying[]) as \"NameType\", \n            unnest($2::text[]) as \"Description\",\n            unnest($3::timestamp[]) as \"createdAt\",\n            unnest($4::timestamp[]) as \"changeAt\",\n            unnest($5::character varying[]) as \"createBy\",\n            unnest($6::character varying[]) as \"changeBy\"\n            ON CONFLICT (\"NameType\") DO UPDATE \n              SET \"Description\" = EXCLUDED.\"Description\",\n                \"changeAt\"=EXCLUDED.\"changeAt\",\n                \"changeBy\"=EXCLUDED.\"changeBy\";"; // queryMany += query;
                    // queryMany = queryMany.concat(query);

                    _context.next = 13;
                    return regeneratorRuntime.awrap(db.query(query, [valueCode, valueName, valueTime, valueTime, valueUsers, valueUsers]));

                  case 13:
                    rsInsertTable = _context.sent;
                    return _context.abrupt("return", 200);

                  case 17:
                    _context.prev = 17;
                    _context.t0 = _context["catch"](0);
                    throw new Error(_context.t0);

                  case 20:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[0, 17]]);
          };

          ;
          getResults().then(function (results) {
            // process results here
            if (results === 200) {
              return res.status(200).json({
                status: 'Success'
              });
            } else {
              return res.status(401).json({
                Message: results.message
              });
            } // console.log(results);

          })["catch"](function (err) {
            // process error here
            return res.status(401).json({
              Message: err.message
            });
            console.log(err);
          }); //   try {
          // const para = req.query.bukrs;
          //     const token = req.headers.authorization.split(' ')[1];
          //     const basicAuth = Buffer.from(token, 'base64').toString('ascii');
          //     var queryMany = ``;
          //     var valueCode = [];
          //     var valueName = [];
          //     var valueTime = [];
          //     var valueUsers = [];
          //     for (let value in req.body) {
          //       valueCode.push(req.body[value].NameType.toUpperCase());
          //       valueName.push(req.body[value].Description);
          //       valueTime.push('now()');
          //       valueUsers.push(basicAuth.split(':')[0]);
          //       queryMany += `    create table prm."${req.body[value].NameType.toUpperCase()}" ( "Description" text, "createdAt" timestamp default now(), "changeAt" timestamp default now(),
          //       "createBy" character varying(10),"changeBy" character varying(10));`
          //     }
          //     var query = `INSERT INTO prm."ModuleRelease" ("NameType", "Description","createdAt","changeAt","createBy","changeBy") 
          //     select  
          //     unnest($1::character varying[]) as "NameType",
          //     unnest($2::text[]) as "Description",
          //     unnest($3::timestamp[]) as "createdAt",
          //     unnest($4::timestamp[]) as "changeAt",
          //     unnest($5::character varying[]) as "createBy",
          //     unnest($6::character varying[]) as "changeBy"
          //     ON CONFLICT ("NameType") DO UPDATE 
          //       SET "Description" = EXCLUDED."Description",
          //         "changeAt"=EXCLUDED."changeAt",
          //         "createBy"=EXCLUDED."createBy";`
          //         queryMany += query;
          //     db.query(query,[valueCode,valueName,valueTime,valueTime,valueUsers,valueUsers], (err, resp) => {
          //       if (err) {
          //         return res.status(404).json({ message: err.message });
          //       } else {
          //         return res.status(200).json({ status:'Success' });
          //       }
          //     })
          //   } catch (error) {
          //     return res.status(500).json({ message: error.message });
          //   }

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  postModuleRelease: postModuleRelease
};
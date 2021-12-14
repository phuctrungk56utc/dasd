"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
var crypt = require("../../crypt/crypt");

require('dotenv').config();

var decodeJWT = require('jwt-decode');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postUserInfo = function postUserInfo(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, query;
  return regeneratorRuntime.async(function postUserInfo$(_context) {
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

          query = "INSERT INTO prm.\"userInfo\" (\"userId\",\"userName\",\"PositionCode\", phone, \"CCCD\" ,sex , email, address,\"Department\", birthday )  \n    select\n    unnest(array['".concat(userId, "']::character varying[]) as \"userId\",\n    unnest(array['").concat(req.body.params.userName, "']::text[]) as \"userName\",\n    unnest(array['").concat(req.body.params.PositionCode, "']::character varying[]) as \"PositionCode\",\n    unnest(array[").concat(req.body.params.phone, "]::integer[]) as phone,\n    unnest(array['").concat(req.body.params.CCCD, "']::character varying[]) as \"CCCD\",\n    unnest(array['").concat(req.body.params.sex, "']::character varying[]) as sex,\n    unnest(array['").concat(req.body.params.email, "']::character varying[]) as email,\n    unnest(array['").concat(req.body.params.address, "']::text[]) as address,\n    unnest(array['").concat(req.body.params.Department, "']::text[]) as \"Department\",\n    unnest(array['").concat(req.body.params.birthday, "']::text[]) as birthday\n    ON CONFLICT (\"userId\") DO UPDATE \n      SET \n      \"userId\" = EXCLUDED.\"userId\",\n      \"userName\" = EXCLUDED.\"userName\",\n      \"PositionCode\" = EXCLUDED.\"PositionCode\",\n      phone = EXCLUDED.phone,\n      \"CCCD\" = EXCLUDED.\"CCCD\",\n      sex = EXCLUDED.sex,\n      email = EXCLUDED.email,\n      address = EXCLUDED.address,\n      \"Department\" = EXCLUDED.\"Department\",\n      birthday = EXCLUDED.birthday\n      ;"); //   UPDATE prm."userInfo"
          //   SET "userName"=${req.body.params.userName}, "PositionCode"=${req.body.params.PositionCode}, phone=${req.body.params.phone},
          //    "CCCD"=${req.body.params.CCCD}, sex=${req.body.params.sex}, email=${req.body.params.email},
          //     address=${req.body.params.address}, "Department"=${req.body.params.Department}, birthday=${req.body.params.birthday}
          //   WHERE "userId"='${req.body.params.userId};

          db.query(query, function (err, resp) {
            if (err) {
              return res.status(200).json({
                message: 'err'
              });
            } else {
              return res.status(200).json({
                message: 'success'
              });
            }
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            database: _context.t0
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  postUserInfo: postUserInfo
};
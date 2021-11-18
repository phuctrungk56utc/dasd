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


var postStrategy = function postStrategy(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, query, leng, index, stringValueChiden;
  return regeneratorRuntime.async(function postStrategy$(_context) {
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

          _context.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"Strategy\"\n        WHERE \"ReleaseType\"='".concat(req.body.params.dataStrategy[0].ReleaseType, "';")));

        case 5:
          query = "INSERT INTO prm.\"Strategy\"(\n            \"Release_ID\", \"Description\", \"Release_Level\",\"ReleaseType\", \"userId\", \"createAt\", \"changeAt\", \"createBy\", \"changeBy\")\n            VALUES ";
          leng = req.body.params.dataStrategy.length;

          for (index in req.body.params.dataStrategy) {
            stringValueChiden = '';
            stringValueChiden = "('".concat(req.body.params.dataStrategy[index].Release_ID, "','").concat(req.body.params.dataStrategy[index].Description, "',\n            '").concat(req.body.params.dataStrategy[index].Release_Level, "','").concat(req.body.params.dataStrategy[index].ReleaseType, "',\n            '").concat(req.body.params.dataStrategy[index].userId, "','now()','now()','").concat(userId, "','").concat(userId, "')");

            if (leng > Number(index) + 1) {
              stringValueChiden += ',';
            }

            query += stringValueChiden;
          }

          query += ';';
          db.query(query, function (err, resp) {
            if (err) {
              return res.status(404).json({
                message: err.message
              });
            } else {
              return res.status(200).json(resp.rows);
            }
          });
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  postStrategy: postStrategy
};
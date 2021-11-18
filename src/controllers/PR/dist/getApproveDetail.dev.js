"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();

var crypt = require("../../crypt/crypt");

var sleep = require('sleep');

var db = require("../../db/db");

var decodeJWT = require('jwt-decode');

var axios = require('axios');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getApproveDetail = function getApproveDetail(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, size, query, author, RELEASE_LEVEL, index, checkAuthorValue, _index;

  return regeneratorRuntime.async(function getApproveDetail$(_context) {
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
          }; //get user call


          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0];
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
          } // Get the size of an object


          size = Object.size(req.query);

          if (size > 0) {
            query = "SELECT * FROM prm.\"PR_RELEASE_STRATEGY\" \n        WHERE \"".concat(Object.keys(req.query)[0], "\"=").concat(String(req.query[Object.keys(req.query)[0]]), ";");
          } else {
            query = "SELECT * FROM prm.\"PR_RELEASE_STRATEGY\" ;";
          } // get and check author for PR approve


          _context.next = 8;
          return regeneratorRuntime.awrap(db.query("select * from prm.\"PR_RELEASE_STRATEGY\" WHERE\n\t\t\t\t\t \"PR_NO\"=".concat(String(req.query[Object.keys(req.query)[0]]), " ")));

        case 8:
          author = _context.sent;
          RELEASE_LEVEL = 1;

          for (index in author.rows) {
            if (author.rows[index].userId === String(userId).toUpperCase()) {
              RELEASE_LEVEL = author.rows[index].RELEASE_LEVEL;
            }
          }

          checkAuthorValue = true;
          _context.t0 = regeneratorRuntime.keys(author.rows);

        case 13:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 23;
            break;
          }

          _index = _context.t1.value;

          if (!(RELEASE_LEVEL === 1 && author.rows[_index].ACTION_CODE === 0)) {
            _context.next = 18;
            break;
          }

          checkAuthorValue = true;
          return _context.abrupt("break", 23);

        case 18:
          if (!(author.rows[_index].RELEASE_LEVEL < RELEASE_LEVEL && author.rows[_index].ACTION_CODE !== 1)) {
            _context.next = 21;
            break;
          }

          checkAuthorValue = false;
          return _context.abrupt("break", 23);

        case 21:
          _context.next = 13;
          break;

        case 23:
          db.query(query, function (err, resp) {
            if (err) {
              return res.status(404).json({
                message: err.message
              });
            } else {
              return res.status(200).json({
                data: resp.rows,
                authApprove: checkAuthorValue
              });
            }
          });
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t2 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t2.message
          }));

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

module.exports = {
  getApproveDetail: getApproveDetail
};
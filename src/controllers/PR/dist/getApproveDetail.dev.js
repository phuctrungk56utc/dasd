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
  var userId, token, basicAuth, accessToken, decodeTk, size, query, author, checkAuthorValue, index, j;
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
            query = "SELECT * FROM prm.\"PR_RELEASE_STRATEGY\" \n        WHERE \"".concat(Object.keys(req.query)[0], "\"=").concat(String(req.query[Object.keys(req.query)[0]]), " ORDER BY \"RELEASE_LEVEL\" ASC ;");
          } else {
            query = "SELECT * FROM prm.\"PR_RELEASE_STRATEGY\"  ORDER BY \"RELEASE_LEVEL\" ASC ;";
          } // get and check author for PR approve


          _context.next = 8;
          return regeneratorRuntime.awrap(db.query("select * from prm.\"PR_RELEASE_STRATEGY\" WHERE\n\t\t\t\t\t \"PR_NO\"=".concat(String(req.query[Object.keys(req.query)[0]]), "  ORDER BY \"RELEASE_LEVEL\" ASC ;")));

        case 8:
          author = _context.sent;
          // var RELEASE_LEVEL = 1;
          // for (let index in author.rows) {
          // 	if (author.rows[index].userId === String(userId).toUpperCase()) {
          // 		RELEASE_LEVEL = author.rows[index].RELEASE_LEVEL;
          // 	}
          // }
          checkAuthorValue = false;
          _context.t0 = regeneratorRuntime.keys(author.rows);

        case 11:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 24;
            break;
          }

          index = _context.t1.value;

          if (!(userId === author.rows[index].userId && author.rows[index].ACTION_CODE === 0)) {
            _context.next = 22;
            break;
          }

          _context.t2 = regeneratorRuntime.keys(author.rows);

        case 15:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 22;
            break;
          }

          j = _context.t3.value;

          if (!(author.rows[index].RELEASE_LEVEL === 1 && author.rows[index].ACTION_CODE === 0 || author.rows[index].RELEASE_LEVEL > author.rows[j].RELEASE_LEVEL && author.rows[j].ACTION_CODE === 1)) {
            _context.next = 20;
            break;
          }

          checkAuthorValue = true;
          return _context.abrupt("break", 22);

        case 20:
          _context.next = 15;
          break;

        case 22:
          _context.next = 11;
          break;

        case 24:
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
          _context.next = 30;
          break;

        case 27:
          _context.prev = 27;
          _context.t4 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t4.message
          }));

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

module.exports = {
  getApproveDetail: getApproveDetail
};
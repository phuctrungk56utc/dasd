"use strict";

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


var getUserRoleAuthorization = function getUserRoleAuthorization(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk;
  return regeneratorRuntime.async(function getUserRoleAuthorization$(_context) {
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
            userId = decodeTk.userId;
          }

          db.query("SELECT r.\"RoleType\",r.\"View\",r.\"Create/Edit/Delete\",r.\"All\",r.\"Approve\" FROM prm.\"roles\" r INNER JOIN prm.\"userRole\" u \n    ON r.\"RoleID\" = u.\"RoleID\" WHERE u.\"userId\"='".concat(userId, "' "), function (err, resp) {
            if (err) {
              return res.status(500).json({
                message: err
              });
            } else {
              return res.status(200).json({
                item: resp.rows
              });
            }
          });
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            message: _context.t0
          }));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

module.exports = {
  getUserRoleAuthorization: getUserRoleAuthorization
};
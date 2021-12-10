"use strict";

/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/auth.js
 */
var jwtHelper = require("../helpers/jwt.helper");

var debug = console.log.bind(console);

var db = require("../db/db");

var crypt = require("../crypt/crypt");

var jwt = require("jsonwebtoken");

var decodeJWT = require('jwt-decode'); // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file


var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-trungquandev.com-green-cat-a@";
var accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res
 * @param {*} next 
 */

var isPrData = function isPrData(req, res, next) {
  var token, userId, basicAuth, accessToken, decodeTk, checkRole, roleApi, checkAuthoRole, checkRun, index, _basicAuth, _accessToken;

  return regeneratorRuntime.async(function isPrData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.headers.authorization.split(' ')[1] ? req.headers.authorization.split(' ')[1] : req.headers.authorization;
          userId = '';

          if (req.headers.authorization.split(' ')[1]) {
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0].toUpperCase();
          } else {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
          }

          checkRole = null;
          roleApi = null;
          checkAuthoRole = false;
          checkRun = false;

          if (!(req.originalUrl.split('?')[0] !== '/getNotification' && req.originalUrl.split('?')[0] !== '/updateStatus' && req.originalUrl.split('?')[0] !== '/getUserInfo' && req.originalUrl.split('?')[0] !== '/postNotificationMobile' && req.originalUrl.split('?')[0] !== '/postUserInfo' && req.originalUrl.split('?')[0] !== '/changePass')) {
            _context.next = 30;
            break;
          }

          checkRun = true;
          _context.next = 12;
          return regeneratorRuntime.awrap(db.query("select t2.\"RoleType\",t2.\"View\",t2.\"Create/Edit/Delete\",t2.\"Approve\",t2.\"All\" from prm.\"userRole\" t1 inner join\n        prm.\"roles\" t2 on t1.\"RoleID\" = t2.\"RoleID\" where t1.\"userId\"='".concat(userId, "'")));

        case 12:
          checkRole = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM prm.\"roleApi\" where \"api\"='".concat(req.originalUrl.split('?')[0], "'")));

        case 15:
          roleApi = _context.sent;
          _context.prev = 16;
          _context.t0 = regeneratorRuntime.keys(checkRole.rows);

        case 18:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 25;
            break;
          }

          index = _context.t1.value;

          if (!(checkRole.rows[index].RoleType === 'All' || checkRole.rows[index].All === true && checkRole.rows[index].RoleType === roleApi.rows[0].RoleType || eval("checkRole.rows[index]['".concat(roleApi.rows[0].action, "']")) === true && checkRole.rows[index].RoleType === roleApi.rows[0].RoleType)) {
            _context.next = 23;
            break;
          }

          checkAuthoRole = true;
          return _context.abrupt("break", 25);

        case 23:
          _context.next = 18;
          break;

        case 25:
          _context.next = 30;
          break;

        case 27:
          _context.prev = 27;
          _context.t2 = _context["catch"](16);
          return _context.abrupt("return", res.status(403).json({
            message: 'File do not exits'
          }));

        case 30:
          if (!(checkAuthoRole && checkRun || !checkRun)) {
            _context.next = 45;
            break;
          }

          if (!req.headers.authorization.split(' ')[1]) {
            _context.next = 42;
            break;
          }

          _basicAuth = Buffer.from(token, 'base64').toString('ascii');
          _context.prev = 33;
          db.query("SELECT * FROM prm.users users WHERE \"users\".\"userId\" = '".concat(_basicAuth.split(':')[0].toUpperCase(), "'"), function (err, resp) {
            if (err) {
              return res.status(500).json({
                err: err
              });
            } else {
              if (resp.rows.length > 0 && crypt.encrypt(String(_basicAuth.split(':')[1])) === resp.rows[0].password) {
                // return res.status(200).json({ data: resp.rows[0].userId });
                next();
              } else {
                return res.status(403).json({
                  message: 'Authentication error'
                });
              }
            }
          });
          _context.next = 40;
          break;

        case 37:
          _context.prev = 37;
          _context.t3 = _context["catch"](33);
          return _context.abrupt("return", res.status(403).json({
            message: 'Authentication error'
          }));

        case 40:
          _context.next = 43;
          break;

        case 42:
          try {
            _accessToken = crypt.decrypt(token);
            jwt.verify(_accessToken, accessTokenSecretAccess, function (error, decoded) {
              if (error) {
                next(); // return res.status(404).json({ error,message:'session expires' });
              } else {
                next();
              }
            });
          } catch (error) {
            next(); // return res.status(500).json({ error });
          }

        case 43:
          _context.next = 46;
          break;

        case 45:
          return _context.abrupt("return", res.status(403).json({
            message: 'You are not authorized to perform this action'
          }));

        case 46:
          _context.next = 51;
          break;

        case 48:
          _context.prev = 48;
          _context.t4 = _context["catch"](0);
          return _context.abrupt("return", res.status(403).json({
            message: 'Authentication error'
          }));

        case 51:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 48], [16, 27], [33, 37]]);
};

module.exports = {
  isPrData: isPrData
};
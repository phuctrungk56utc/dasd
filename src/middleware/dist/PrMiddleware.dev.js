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
  var token, userId, basicAuth, accessToken, decodeTk, _basicAuth, _accessToken;

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
          } // var checkRole = null
          // var roleApi = null
          // var checkAuthoRole = false;
          // var checkRun = false
          // if (req.originalUrl.split('?')[0] !== '/getNotification' && req.originalUrl.split('?')[0] !== '/updateStatus'
          //     && req.originalUrl.split('?')[0] !== '/getUserInfo' && req.originalUrl.split('?')[0] !== '/postNotificationMobile'
          //     && req.originalUrl.split('?')[0] !== '/postUserInfo' && req.originalUrl.split('?')[0] !== '/changePass') {
          //     checkRun = true;
          //     checkRole = await db.query(`select t2."RoleType",t2."View",t2."Create/Edit/Delete",t2."Approve",t2."All" from prm."userRole" t1 inner join
          // prm."roles" t2 on t1."RoleID" = t2."RoleID" where t1."userId"='${userId}'`);
          //     roleApi = await db.query(`SELECT * FROM prm."roleApi" where "api"='${req.originalUrl.split('?')[0]}'`);
          //     try {
          //         for (let index in checkRole.rows) {
          //             if (checkRole.rows[index].RoleType === 'All') {
          //                 checkAuthoRole = true;
          //                 break
          //             }
          //             if ((checkRole.rows[index].All && checkRole.rows[index].RoleType === roleApi.rows[0].RoleType) ||
          //                 (eval(`checkRole.rows[index]['${roleApi.rows[0].action}']`) === true && checkRole.rows[index].RoleType === roleApi.rows[0].RoleType)) {
          //                 checkAuthoRole = true;
          //                 break
          //             }
          //         }
          //     } catch (error) {
          //         return res.status(403).json({ message: 'Authentication error' });
          //         // next();
          //     }
          // }
          // (checkAuthoRole && checkRun || (!checkRun))
          // if (checkAuthoRole && checkRun || (!checkRun)) {


          if (!req.headers.authorization.split(' ')[1]) {
            _context.next = 15;
            break;
          }

          _basicAuth = Buffer.from(token, 'base64').toString('ascii');
          _context.prev = 6;
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
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](6);
          return _context.abrupt("return", res.status(403).json({
            message: 'Authentication error'
          }));

        case 13:
          _context.next = 16;
          break;

        case 15:
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

        case 16:
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t1 = _context["catch"](0);
          return _context.abrupt("return", res.status(403).json({
            message: 'Authentication error'
          }));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18], [6, 10]]);
};

module.exports = {
  isPrData: isPrData
};
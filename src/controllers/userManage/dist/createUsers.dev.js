"use strict";

require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode');

var socIo = require("../../../server");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var createUsers = function createUsers(req, res) {
  var notification, userId, token, basicAuth, accessToken, decodeTk, listUsers, activate, refreshToken, userCreate, time, listUsersModifyPass, passwordModifyPass, activateModifyPass, refreshTokenModifyPass, userCreateModifyPass, timeModifyPass, index, query, queryNoUpdatePass, rs, i, _index;

  return regeneratorRuntime.async(function createUsers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // await sleep.sleep(30);
          notification = socIo;
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

          listUsers = []; // var password = [];

          activate = [];
          refreshToken = [];
          userCreate = [];
          time = [];
          listUsersModifyPass = [];
          passwordModifyPass = [];
          activateModifyPass = [];
          refreshTokenModifyPass = [];
          userCreateModifyPass = [];
          timeModifyPass = [];

          for (index in req.body.params.UsersClone) {
            if (req.body.params.UsersClone[index].password !== '') {
              listUsersModifyPass.push(req.body.params.UsersClone[index].userId);
              activateModifyPass.push(req.body.params.UsersClone[index].activate);
              userCreateModifyPass.push(userId);
              refreshTokenModifyPass.push('');
              passwordModifyPass.push(crypt.encrypt(req.body.params.UsersClone[index].password));
              timeModifyPass.push('now()');
            } else {
              listUsers.push(req.body.params.UsersClone[index].userId);
              activate.push(req.body.params.UsersClone[index].activate);
              userCreate.push(userId);
              refreshToken.push(''); // password.push(crypt.encrypt(req.body.params.UsersClone[index].password))

              time.push('now()');
            }
          }

          query = "INSERT INTO prm.\"users\" (\"userId\", \"activate\",\"refreshToken\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\")  \n\t\tselect \n\t\tunnest($1::character varying[]) as \"userId\", \n\t\tunnest($2::boolean[]) as \"activate\",\n\t\tunnest($3::text[]) as \"refreshToken\",\n\n\t\tunnest($4::timestamp[]) as \"createdAt\",\n\t\tunnest($5::timestamp[]) as \"changeAt\",\n\t\tunnest($6::character varying[]) as \"createBy\",\n\t\tunnest($7::character varying[]) as \"changeBy\"\n\n\t\tON CONFLICT (\"userId\") DO UPDATE \n\t\t  SET\n\t\t  \"activate\"=EXCLUDED.\"activate\",\n\t\t  \"refreshToken\"=EXCLUDED.\"refreshToken\",\n\t\t\t\"changeAt\"=EXCLUDED.\"changeAt\",\n\t\t\t\"changeBy\"=EXCLUDED.\"changeBy\";";
          queryNoUpdatePass = "INSERT INTO prm.\"users\" (\"userId\", \"password\",\"activate\",\"refreshToken\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\")  \n\t\t\tselect \n\t\t\tunnest($1::character varying[]) as \"userId\", \n\t\t\tunnest($2::character varying[]) as \"password\",\n\t\t\tunnest($3::boolean[]) as \"activate\",\n\t\t\tunnest($4::text[]) as \"refreshToken\",\n\t\n\t\t\tunnest($5::timestamp[]) as \"createdAt\",\n\t\t\tunnest($6::timestamp[]) as \"changeAt\",\n\t\t\tunnest($7::character varying[]) as \"createBy\",\n\t\t\tunnest($8::character varying[]) as \"changeBy\"\n\t\n\t\t\tON CONFLICT (\"userId\") DO UPDATE \n\t\t\t  SET \"password\" = EXCLUDED.\"password\",\n\t\t\t  \"activate\"=EXCLUDED.\"activate\",\n\t\t\t  \"refreshToken\"=EXCLUDED.\"refreshToken\",\n\t\t\t\t\"changeAt\"=EXCLUDED.\"changeAt\",\n\t\t\t\t\"changeBy\"=EXCLUDED.\"changeBy\";";
          _context.next = 20;
          return regeneratorRuntime.awrap(db.query(query, [listUsers, activate, refreshToken, time, time, userCreate, userCreate]));

        case 20:
          rs = _context.sent;
          _context.next = 23;
          return regeneratorRuntime.awrap(db.query(queryNoUpdatePass, [listUsersModifyPass, passwordModifyPass, activateModifyPass, refreshTokenModifyPass, timeModifyPass, timeModifyPass, userCreateModifyPass, userCreateModifyPass]));

        case 23:
          for (i in notification.ioObject.listUSer) {
            for (_index in req.body.params.UsersClone) {
              if (notification.ioObject.listUSer[i].userId.toUpperCase() === req.body.params.UsersClone[_index].userId.toUpperCase()) {
                notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("logoutFromServer");
              }
            }
          }

          return _context.abrupt("return", res.status(200).json({
            message: 'success'
          }));

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

module.exports = {
  createUsers: createUsers
};
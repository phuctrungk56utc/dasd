"use strict";

require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode'); // unnest($1::character varying[]) as "RoleID",
// unnest($2::character varying[]) as "RoleType",
// unnest($3::text[]) as "Description",
// unnest($4::boolean[]) as "View",
// unnest($5::boolean[]) as "Create/Edit/Delete",
// unnest($6::boolean[]) as "Approve",
// unnest($7::boolean[]) as "All",
// unnest($8::timestamp[]) as "createdAt",
// unnest($9::timestamp[]) as "changeAt",
// unnest($10::character varying[]) as "createBy",
// unnest($11::character varying[]) as "changeBy"
// ON CONFLICT ("RoleID") DO UPDATE 
// SET
// "RoleType" = EXCLUDED."RoleType",
// "Description" = EXCLUDED."Description",
// "View" = EXCLUDED."View",
// "Create/Edit/Delete" = EXCLUDED."Create/Edit/Delete",
// "Approve" = EXCLUDED."Approve",
// "All" = EXCLUDED."All",
// "changeAt"=EXCLUDED."changeAt",
// "createBy"=EXCLUDED."createBy";

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postRole = function postRole(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, query, leng, index, stringValueChiden;
  return regeneratorRuntime.async(function postRole$(_context) {
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

          _context.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.roles;"));

        case 5:
          query = "INSERT INTO prm.\"roles\" (\"RoleID\",\"RoleType\",\"Description\",\"View\",\"Create/Edit/Delete\",\"Approve\",\"All\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\") \n    VALUES ";
          leng = req.body.params.role.length;

          for (index in req.body.params.role) {
            stringValueChiden = '';
            stringValueChiden = "('".concat(req.body.params.role[index].RoleID, "',\n        '").concat(req.body.params.role[index].RoleType, "',\n        '").concat(req.body.params.role[index].Description, "',\n        '").concat(req.body.params.role[index].View === null ? false : req.body.params.role[index].View, "',\n        '").concat(req.body.params.role[index]["Create/Edit/Delete"] === null ? false : req.body.params.role[index]["Create/Edit/Delete"], "',\n        '").concat(req.body.params.role[index].Approve === null ? false : req.body.params.role[index].Approve, "',\n        '").concat(req.body.params.role[index].All === null ? false : req.body.params.role[index].All, "',\n        'now()','now()','").concat(userId, "','").concat(userId, "')");

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
              return res.status(200).json({
                message: 'Success'
              });
            }
          });
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
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
  postRole: postRole
};
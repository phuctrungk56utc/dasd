"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getListRelease = function getListRelease(req, res) {
  var query;
  return regeneratorRuntime.async(function getListRelease$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            query = "select \"Release_ID\" from prm.\"".concat(req.query.type, "\""); // query = `${req.query.query}`;

            db.query(query, function (err, resp) {
              if (err) {
                return res.status(404).json({
                  message: err.message
                });
              } else {
                return res.status(200).json(resp.rows);
              }
            });
          } catch (error) {
            console.log(error);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  getListRelease: getListRelease
};
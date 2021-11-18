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


var releaseCondition = function releaseCondition(req, res) {
  var size, query;
  return regeneratorRuntime.async(function releaseCondition$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            Object.size = function (obj) {
              var size = 0,
                  key;

              for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
              }

              return size;
            }; // Get the size of an object


            size = Object.size(req.query);

            if (size > 0) {
              query = "SELECT * FROM prm.\"".concat(req.query.releaseType, "\"\n        WHERE \"").concat(Object.keys(req.query)[0], "\"=").concat(String(req.query[Object.keys(req.query)[0]]));
            } else {
              query = "SELECT * FROM prm.\"".concat(req.query.releaseType, "\"");
            }

            query = "".concat(req.query.query);
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
  releaseCondition: releaseCondition
};
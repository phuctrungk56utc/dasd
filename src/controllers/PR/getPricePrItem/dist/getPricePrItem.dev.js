"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();

var sleep = require('sleep');

var db = require("../../../db/db");

var apiSap = require("../../../apiSap/apiSap");

var axios = require('axios');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var getPricePrItem = function getPricePrItem(req, res) {
  var api, data;
  return regeneratorRuntime.async(function getPricePrItem$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\" WHERE \"api_key\"='getPrice'"));

        case 3:
          api = _context.sent;

          if (!(api.rows.length > 0)) {
            _context.next = 9;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(apiSap.apiSap(api.rows[0].api, req.query.dataSelectItem, 'GET'));

        case 7:
          data = _context.sent;
          return _context.abrupt("return", res.status(200).json(data.data));

        case 9:
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = {
  getPricePrItem: getPricePrItem
};
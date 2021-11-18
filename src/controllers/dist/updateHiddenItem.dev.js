"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config(); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var updateHiddenItem = function updateHiddenItem(req, res) {
  var query;
  return regeneratorRuntime.async(function updateHiddenItem$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            // await sleep.sleep(1);
            // const para = req.query.PR_NO;
            query = "SELECT * FROM prm.\"hiddenItem\""; // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {

            db.query(query, function (err, resp) {
              if (err) {
                return res.status(404).json({
                  database: err
                });
              } else {
                var valueUpdate = new Array();
                var Id = new Array();
                var displayOnly = new Array();
                var required = new Array();
                var defaultValue = new Array();

                for (var value in req.body.data) {
                  if (value !== 'Item number' && value !== 'id') {
                    // let e = {};
                    // e.fieldId = value;
                    // e.displayOnly = req.body.data[value].hidden;
                    // e.required = req.body.data[value].required;
                    // e.defaultValue = req.body.data[value].value;
                    // valueUpdate.push(e);
                    Id.push(value);
                    displayOnly.push(req.body.data[value].hidden);
                    required.push(req.body.data[value].required);
                    defaultValue.push(req.body.data[value].value);
                  }
                } //     const queryUpdate = `UPDATE prm."hiddenItem" AS db
                //   SET displayOnly         = source.displayOnly,
                //   required= source.required
                //       FROM (
                //       VALUES ${valueUpdate}
                //   ) AS source(fieldId, displayOnly,required, value , defaultValue)
                //       WHERE source.fieldId = db.fieldId;`;


                var queryUpdate2 = "update prm.\"hiddenItem\" as rd\n                  set    \"displayOnly\"=new.displayOnly,\n                  \"required\"=new.required,\n                  \"defaultValue\"=new.defaultValue\n                  from (select \n                unnest($1::character varying[]) as fieldId,\n                  unnest($2::boolean[]) as displayOnly,\n                  unnest($3::boolean[]) as required,unnest($4::text[]) as defaultValue) as new\n                  where rd.\"fieldId\"=new.fieldId;"; // var a = []

                db.query(queryUpdate2, [Id, displayOnly, required, defaultValue], function (err, resp) {
                  if (err) {
                    return res.status(404).json({
                      database: err
                    });
                  } else {
                    return res.status(200).json({
                      status: 'Success'
                    }); // console.log(err)
                  }
                }); // return res.status(200).json({ item: resp.rows });
              }
            });
          } catch (error) {}

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  updateHiddenItem: updateHiddenItem
};
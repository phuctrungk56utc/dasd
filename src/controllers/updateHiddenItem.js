// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let updateHiddenItem = async (req, res) => {
    try {
        // await sleep.sleep(1);

        // const para = req.query.PR_NO;
        var query = `SELECT * FROM prm."hiddenItem"`
        // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {
        db.query(query, (err, resp) => {
            if (err) {
                return res.status(404).json({ database: err });
            } else {
                const valueUpdate = new Array();

                const Id = new Array();
                const displayOnly = new Array();
                const required = new Array();
                const defaultValue = new Array();
                for (let value in req.body.data) {
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
                }
            //     const queryUpdate = `UPDATE prm."hiddenItem" AS db
            //   SET displayOnly         = source.displayOnly,
            //   required= source.required

            //       FROM (
            //       VALUES ${valueUpdate}
            //   ) AS source(fieldId, displayOnly,required, value , defaultValue)
            //       WHERE source.fieldId = db.fieldId;`;


                  const queryUpdate2 = `update prm."hiddenItem" as rd
                  set    "displayOnly"=new.displayOnly,
                  "required"=new.required,
                  "defaultValue"=new.defaultValue
                  from (select 
                unnest($1::character varying[]) as fieldId,
                  unnest($2::boolean[]) as displayOnly,
                  unnest($3::boolean[]) as required,unnest($4::text[]) as defaultValue) as new
                  where rd."fieldId"=new.fieldId;`

                    // var a = []
                db.query(queryUpdate2,[Id,displayOnly,required,defaultValue], (err, resp) => {
                    if (err) {
                        return res.status(404).json({ database: err });
                    } else {
                        return res.status(200).json({ status: 'Success' });
                        // console.log(err)
                    }
                })
                // return res.status(200).json({ item: resp.rows });
            }
        })
    } catch (error) {

    }

}
module.exports = {
    updateHiddenItem: updateHiddenItem,
}

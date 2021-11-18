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
let PrItem = async (req, res) => {
  try {
    // await sleep.sleep(1);

    const para = req.query.PR_NO;
    var query;
    if(para){
        query = `SELECT * FROM prm."PrItem" 
        WHERE "PR_NO"=${para}`
    }else{
        query = `SELECT * FROM prm."PrItem"`
    }
    // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {
    db.query(query, (err, resp) => {
        if (err) {
            return res.status(404).json({ database: err });
          } else {
            return res.status(200).json({ item: resp.rows });
          }
    }) 
  } catch (error) {
    return res.status(404).json({ database: error });
  }

}
module.exports = {
    PrItem: PrItem,
}

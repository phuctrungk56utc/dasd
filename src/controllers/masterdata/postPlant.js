// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let Plant = async (req, res) => {
  try {
    // const para = req.query.bukrs;
    const token = req.headers.authorization.split(' ')[1];
    const basicAuth = Buffer.from(token, 'base64').toString('ascii');
    var valueCode = [];
    var valueName = [];
    var valueLvorm = [];
    var valueTime = [];
    var valueUsers = [];
    for (let value in req.body) {
      valueCode.push(req.body[value].werks);
      valueName.push(req.body[value].name1);
      if(req.body[value].lvorm) {
        valueLvorm.push(req.body[value].lvorm);
      }else {
        valueLvorm.push('');
      }
      // valueLvorm.push(req.body[value].lvorm);
      valueTime.push('now()');
      valueUsers.push(basicAuth.split(':')[0]);
    }
    var query = `INSERT INTO prm."Plant" (werks, name1, lvorm,"createdAt","changeAt","createBy","changeBy") 
    select  
    unnest($1::character varying[]) as werks,
    unnest($2::text[]) as name1,
    unnest($3::char[]) as lvorm,
    unnest($4::timestamp[]) as "createdAt",
    unnest($5::timestamp[]) as "changeAt",
    unnest($6::character varying[]) as "createBy",
    unnest($7::character varying[]) as "changeBy"
    ON CONFLICT (werks) DO UPDATE 
      SET name1 = EXCLUDED.name1,
        lvorm = EXCLUDED.lvorm,
        "changeAt"=EXCLUDED."changeAt",
        "createBy"=EXCLUDED."createBy";`
    db.query(query,[valueCode,valueName,valueLvorm,valueTime,valueTime,valueUsers,valueUsers], (err, resp) => {
      if (err) {
        return res.status(404).json({ message: err.message });
      } else {
        return res.status(200).json({ status:'Success' });
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}
module.exports = {
  Plant: Plant,
}

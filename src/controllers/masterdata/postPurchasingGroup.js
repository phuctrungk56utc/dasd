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
let postPurchasingGroup = async (req, res) => {
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
      valueCode.push(req.body[value].ekgrp);
      valueName.push(req.body[value].eknam);
      valueLvorm.push(req.body[value].lvorm);
      valueTime.push('now()');
      valueUsers.push(basicAuth.split(':')[0].toUpperCase());
    }
    var query = `INSERT INTO prm."PurchasingGroup" (ekgrp, eknam, lvorm,"createdAt","changeAt","createBy","changeBy") 
    select  
    unnest($1::character varying[]) as ekgrp,
    unnest($2::text[]) as eknam,
    unnest($3::char[]) as lvorm,
    unnest($4::timestamp[]) as "createdAt",
    unnest($5::timestamp[]) as "changeAt",
    unnest($6::character varying[]) as "createBy",
    unnest($7::character varying[]) as "changeBy"
    ON CONFLICT (ekgrp) DO UPDATE 
      SET eknam = EXCLUDED.eknam,
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
    postPurchasingGroup: postPurchasingGroup,
}

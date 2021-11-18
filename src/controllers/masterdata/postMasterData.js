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
let postMasterData = async (req, res) => {
  try {

    Object.size = function (obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };
    // var size = Object.size(req.query);
    var fieldName = '';
    var fieldForPlan = ''
    var checkFieldNoPlant = false;
    try {
      if (Object.keys(req.body[0])[2] !== undefined) {
        fieldForPlan = "BUKRS";
        fieldName = "WERKS"
      } else {
          throw 'Field fail'
      }
    } catch (error) {
      if (Object.keys(req.body[0])[0].toUpperCase() === 'DESCRIPTION') {
        fieldName = Object.keys(req.body[0])[1].toUpperCase();
        checkFieldNoPlant = true;
      } else {
        fieldName = Object.keys(req.body[0])[0].toUpperCase();
      }
    }

    if (fieldForPlan === "BUKRS") {

      const token = req.headers.authorization.split(' ')[1];
      const basicAuth = Buffer.from(token, 'base64').toString('ascii').split(':')[0].toUpperCase();
      var valueCode = [];
      var valueName = [];
      var valueTime = [];
      var valueUsers = [];
      var BUKRS = []
      for (let value in req.body) {
        eval(`valueCode.push(req.body[value]['${fieldName}']);`)
        valueName.push(req.body[value].DESCRIPTION !== undefined ? req.body[value].DESCRIPTION : req.body[value].DESCRIPTION);
        BUKRS.push(req.body[value].BUKRS)
        valueTime.push('now()');
        valueUsers.push(basicAuth);
      }
      var query = `INSERT INTO prm."${fieldName.toUpperCase()}" ("${fieldName.toUpperCase()}","BUKRS", "DESCRIPTION","createdAt","changeAt","createBy","changeBy") 
          select  
          unnest($1::character varying[]) as "${fieldName.toUpperCase()}",
          unnest($2::character varying[]) as "BUKRS",
          unnest($3::text[]) as "DESCRIPTION",

          unnest($4::timestamp[]) as "createdAt",
          unnest($5::timestamp[]) as "changeAt",
          unnest($6::character varying[]) as "createBy",
          unnest($7::character varying[]) as "changeBy"
  
          ON CONFLICT ("${fieldName.toUpperCase()}") DO UPDATE 
            SET 
            "BUKRS" = EXCLUDED."BUKRS",
            "DESCRIPTION" = EXCLUDED."DESCRIPTION",
            "changeAt"=EXCLUDED."changeAt",
            "createBy"=EXCLUDED."createBy";`
      db.query(query, [valueCode, BUKRS, valueName, valueTime, valueTime, valueUsers, valueUsers], (err, resp) => {
        if (err) {
          return res.status(404).json({ message: err.message });
        } else {
          return res.status(200).json({ message: 'Success' });
        }
      })
    } else {

      const token = req.headers.authorization.split(' ')[1];
      const basicAuth = Buffer.from(token, 'base64').toString('ascii').split(':')[0].toUpperCase();
      var valueCode = [];
      var valueName = [];
      var valueTime = [];
      var valueUsers = [];
      for (let value in req.body) {
        if(checkFieldNoPlant){
          eval(`valueCode.push(req.body[value]['${Object.keys(req.body[0])[1]}']);`)
          eval(`valueName.push(req.body[value]['${Object.keys(req.body[0])[0]}']);`)
          // valueName.push(req.body[value].Description && req.body[value].Description);
        }else{
          eval(`valueCode.push(req.body[value]['${Object.keys(req.body[0])[0]}']);`)
          eval(`valueName.push(req.body[value]['${Object.keys(req.body[0])[1]}']);`)
          // valueName.push(req.body[value].Description && req.body[value].Description);
        }
        
        

        valueTime.push('now()');
        valueUsers.push(basicAuth);
      }
      var query = `INSERT INTO prm."${fieldName.toUpperCase()}" ("${fieldName.toUpperCase()}", "DESCRIPTION","createdAt","changeAt","createBy","changeBy") 
        select  
        unnest($1::character varying[]) as "${fieldName.toUpperCase()}",
        unnest($2::text[]) as "DESCRIPTION",

        unnest($3::timestamp[]) as "createdAt",
        unnest($4::timestamp[]) as "changeAt",
        unnest($5::character varying[]) as "createBy",
        unnest($6::character varying[]) as "changeBy"

        ON CONFLICT ("${fieldName.toUpperCase()}") DO UPDATE 
          SET "DESCRIPTION" = EXCLUDED."DESCRIPTION",
            "changeAt"=EXCLUDED."changeAt",
            "createBy"=EXCLUDED."createBy";`

      db.query(query, [valueCode, valueName, valueTime, valueTime, valueUsers, valueUsers], (err, resp) => {
        if (err) {
          return res.status(404).json({ message: err.message });
        } else {
          return res.status(200).json({ message: 'Success' });
        }
      })
    }

  } catch (error) {
    return res.status(404).json({ message: err.message });
  }

}
module.exports = {
  postMasterData: postMasterData,
}

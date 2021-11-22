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
let postMaterial = async (req, res) => {
    try {

        // Object.size = function (obj) {
        //   var size = 0,
        //     key;
        //   for (key in obj) {
        //     if (obj.hasOwnProperty(key)) size++;
        //   }
        //   return size;
        // };
        // if (Object.keys(req.body[0])[0].toUpperCase() === 'DESCRIPTION') {
        //     fieldName = Object.keys(req.body[0])[1].toUpperCase();
        //     checkFieldNoPlant = true;
        //   } else {
        //     fieldName = Object.keys(req.body[0])[0].toUpperCase();
        //   }
        const token = req.headers.authorization.split(' ')[1];
        const basicAuth = Buffer.from(token, 'base64').toString('ascii').split(':')[0].toUpperCase();
        var valueCode = [];
        var valueName = [];
        var valueMATKL = [];
        var valueMEINS = [];
        var valueTime = [];
        var valueUsers = [];
        for (let value in req.body) {
            eval(`valueCode.push(req.body[value]['MATNR']);`)
            eval(`valueMATKL.push(req.body[value]['MATKL']);`)
            eval(`valueMEINS.push(req.body[value]['MEINS']);`)
            eval(`valueName.push(req.body[value]['DESCRIPTION']);`)
            valueTime.push('now()');
            valueUsers.push(basicAuth);
        }

        var query = `INSERT INTO prm."MATNR" ("MATNR","MATKL","MEINS", "DESCRIPTION","createdAt","changeAt","createBy","changeBy") 
        select  
        unnest($1::character varying[]) as "MATNR",
        unnest($2::character varying[]) as "MATKL",
        unnest($3::character varying[]) as "MEINS",
        unnest($4::text[]) as "DESCRIPTION",

        unnest($5::timestamp[]) as "createdAt",
        unnest($6::timestamp[]) as "changeAt",
        unnest($7::character varying[]) as "createBy",
        unnest($8::character varying[]) as "changeBy"

        ON CONFLICT ("MATNR") DO UPDATE 
          SET 
          "MATKL" = EXCLUDED."MATKL",
          "MEINS" = EXCLUDED."MEINS",
          "DESCRIPTION" = EXCLUDED."DESCRIPTION",
            "changeAt"=EXCLUDED."changeAt",
            "createBy"=EXCLUDED."createBy";`

        db.query(query, [valueCode, valueMATKL, valueMEINS, valueName, valueTime, valueTime, valueUsers, valueUsers], (err, resp) => {
            if (err) {
                return res.status(404).json({ message: err.message });
            } else {
                return res.status(200).json({ message: 'Success' });
            }
        })

    } catch (error) {
        return res.status(404).json({ message: err.message });
    }

}
module.exports = {
    postMaterial: postMaterial,
}

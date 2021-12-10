// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let postModuleRelease = async (req, res) => {
    async function getResults() {
        try {
            var userId = '';
            try {
                const token = req.headers.authorization.split(' ')[1];
                const basicAuth = Buffer.from(token, 'base64').toString('ascii'); 
                userId = basicAuth.split(':')[0].toUpperCase();
            } catch (error) {
                const accessToken = crypt.decrypt(req.headers.authorization);
                const decodeTk = decodeJWT(accessToken);
                userId = decodeTk.userId;
            }

            var queryMany = ``;
            var valueCode = [];
            var valueName = [];
            var valueTime = [];
            var valueUsers = [];
            const dataRq = req.body.params.data || req.body;
            for (let value in dataRq) {
              valueCode.push(dataRq[value].NameType.toUpperCase());
              valueName.push(dataRq[value].Description);
              valueTime.push('now()');
              valueUsers.push(userId);
              queryMany = queryMany.concat(`create table prm."${dataRq[value].NameType.toUpperCase()}" ( "createdAt" timestamp default now(), "changeAt" timestamp default now(), "createBy" character varying(10),"changeBy" character varying(10));`); 
            }
            var query = `INSERT INTO prm."ModuleRelease" ("NameType", "Description","createAt","changeAt","createBy","changeBy")  
            select 
            unnest($1::character varying[]) as "NameType", 
            unnest($2::text[]) as "Description",
            unnest($3::timestamp[]) as "createdAt",
            unnest($4::timestamp[]) as "changeAt",
            unnest($5::character varying[]) as "createBy",
            unnest($6::character varying[]) as "changeBy"
            ON CONFLICT ("NameType") DO UPDATE 
              SET "Description" = EXCLUDED."Description",
                "changeAt"=EXCLUDED."changeAt",
                "changeBy"=EXCLUDED."changeBy";`
                // queryMany += query;
                // queryMany = queryMany.concat(query);
            let rsInsertTable = await db.query(query,[valueCode,valueName,valueTime,valueTime,valueUsers,valueUsers]);
            // try {
            //     let rsCreateTable = await db.query(`select * from prm."${dataRq[value].NameType.toUpperCase()}"`);
            // } catch (error) {
                
            // }
            // let rsCreateTable = await db.query(queryMany);
            return 200;
            // console.log(object)
            // if(rs.rowCount === valueCode.length && valueCode.length === rs2.length){
            //     return 200;
            // }else{
            //     if(rs.rowCount !== valueCode.length){
            //         throw new Error(rs2);
            //     }
            //     else if(rs2.rowCount !== valueCode.length){
            //         throw new Error(rs);
            //     }
            // }
            // return rs;
        } catch (error) {
            throw new Error(error);
        }
    };
    
    getResults().then(results => {
        // process results here
        if(results === 200){
            return res.status(200).json({ status:'Success' });
        }else{
            return res.status(401).json({Message:results.message});
        }
        // console.log(results);
    }).catch(err => {
        // process error here
        return res.status(401).json({Message:err.message});
        console.log(err);
    });
//   try {
    // const para = req.query.bukrs;
//     const token = req.headers.authorization.split(' ')[1];
//     const basicAuth = Buffer.from(token, 'base64').toString('ascii');
//     var queryMany = ``;
//     var valueCode = [];
//     var valueName = [];
//     var valueTime = [];
//     var valueUsers = [];
//     for (let value in req.body) {
//       valueCode.push(req.body[value].NameType.toUpperCase());
//       valueName.push(req.body[value].Description);
//       valueTime.push('now()');
//       valueUsers.push(basicAuth.split(':')[0]);
//       queryMany += `    create table prm."${req.body[value].NameType.toUpperCase()}" ( "Description" text, "createdAt" timestamp default now(), "changeAt" timestamp default now(),
//       "createBy" character varying(10),"changeBy" character varying(10));`
//     }
//     var query = `INSERT INTO prm."ModuleRelease" ("NameType", "Description","createdAt","changeAt","createBy","changeBy") 
//     select  
//     unnest($1::character varying[]) as "NameType",
//     unnest($2::text[]) as "Description",
//     unnest($3::timestamp[]) as "createdAt",
//     unnest($4::timestamp[]) as "changeAt",
//     unnest($5::character varying[]) as "createBy",
//     unnest($6::character varying[]) as "changeBy"
//     ON CONFLICT ("NameType") DO UPDATE 
//       SET "Description" = EXCLUDED."Description",
//         "changeAt"=EXCLUDED."changeAt",
//         "createBy"=EXCLUDED."createBy";`
//         queryMany += query;
//     db.query(query,[valueCode,valueName,valueTime,valueTime,valueUsers,valueUsers], (err, resp) => {
//       if (err) {
//         return res.status(404).json({ message: err.message });
//       } else {
//         return res.status(200).json({ status:'Success' });
//       }
//     })
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }

}
module.exports = {
    postModuleRelease: postModuleRelease,
}

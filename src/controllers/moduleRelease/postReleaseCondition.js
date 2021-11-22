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
let postReleaseCondition = async (req, res) => {
    // async function getResults() {
    try {
        var userId = '';
        try {
            const token = req.headers.authorization.split(' ')[1];
            const basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0];
        } catch (error) {
            const accessToken = crypt.decrypt(req.headers.authorization);
            const decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
        }
        await db.query(`DELETE FROM prm."${req.body.params.releaseType}"; `);
        if(req.body.params.table.length === 0){
            return res.status(200).json( {message:'Xóa thành công'});
        }
        var queryInsert = `INSERT INTO prm."${req.body.params.releaseType}"(
                "Release_ID", "Description", "createBy", "changeBy", "createdAt", "changeAt",`;
        const listRelease = await db.query(`SELECT * FROM prm."ModuleReleaseConditionType" WHERE "tableName"='${req.body.params.releaseType}'`);
        const lengListRelease = listRelease.rows.length;
        var queryInsertValue = '';
        const leng = req.body.params.table.length;
        for (let index in listRelease.rows) {
            let stringValueChiden;
            stringValueChiden = `"${listRelease.rows[index].columnName}_From","${listRelease.rows[index].columnName}_To"`;
            if (lengListRelease > Number(index) + 1) {
                stringValueChiden += ','
            }
            queryInsert += stringValueChiden;

        }
        queryInsert += ') VALUES';
        //value
        for (let index2 in req.body.params.table) {
            var stringValueChidenValue = `('${req.body.params.table[index2].Release_ID}','${req.body.params.table[index2].Description === undefined ? req.body.params.table[index2].Description: ''}','${userId}','${userId}','now()','now()',`;
            
            for (let index in listRelease.rows) {
                eval(`stringValueChidenValue += "'${req.body.params.table[index2][`${listRelease.rows[index].columnName}_From`]}','${req.body.params.table[index2][`${listRelease.rows[index].columnName}_To`]}'"`);
                if (lengListRelease > Number(index) + 1) {
                    stringValueChidenValue += ','
                }
            }
            stringValueChidenValue += ")";
            if (leng > Number(index2) + 1) {
                stringValueChidenValue += ','
            }

            queryInsertValue += stringValueChidenValue;
        }
        queryInsert += queryInsertValue + ';'
        // var queryInsert = `INSERT INTO prm."${req.body.params.releaseType}"(
        //     "Release_ID", "Description", "createdAt", "changeAt", "createBy", "changeBy", "FISTL_From", "FISTL_To", "FIPOS_From", "FIPOS_To", "LOCAL_AMOUNT_From", "LOCAL_AMOUNT_To")
        //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

        await db.query(`${queryInsert}`);
        return res.status(200).json( {message:'Thành công'});
    } catch (error) {
        return res.status(401).json({message:error.message} );
    }
};

// }
module.exports = {
    postReleaseCondition: postReleaseCondition,
}

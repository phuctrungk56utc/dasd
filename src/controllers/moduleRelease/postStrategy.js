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
let postStrategy = async (req, res) => {
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
        if (req.body.params.dataStrategy.length === 0) {
            await db.query(`DELETE FROM prm."Strategy";`);
            return res.status(200).json({code:200,message:'Success'});
        } else {
            await db.query(`DELETE FROM prm."Strategy"
        WHERE "ReleaseType"='${req.body.params.dataStrategy[0].ReleaseType}';`);
            var query = `INSERT INTO prm."Strategy"(
            "Release_ID", "Description", "Release_Level","ReleaseType", "userId", "createAt", "changeAt", "createBy", "changeBy")
            VALUES `
            const leng = req.body.params.dataStrategy.length;
            for (let index in req.body.params.dataStrategy) {
                var stringValueChiden = '';
                stringValueChiden = `('${req.body.params.dataStrategy[index].Release_ID}','${req.body.params.dataStrategy[index].Description}',
            '${req.body.params.dataStrategy[index].Release_Level}','${req.body.params.dataStrategy[index].ReleaseType}',
            '${req.body.params.dataStrategy[index].userId.toUpperCase()}','now()','now()','${userId}','${userId}')`;
                if (leng > Number(index) + 1) {
                    stringValueChiden += ','
                }

                query += stringValueChiden;
            }
            query += ';'
            db.query(query, (err, resp) => {
                if (err) {
                    return res.status(404).json({ message: err.message });
                } else {
                    return res.status(200).json(resp.rows);
                }
            })
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}
module.exports = {
    postStrategy: postStrategy,
}

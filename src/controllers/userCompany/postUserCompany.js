// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()

const db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let postUserCompany = async (req, res) => {
    try {
        var queryRoot = `DELETE FROM prm."userCompany" WHERE "userId" IN (`;
        var lengthList = req.body.params.params.list.length;
        for (let i in req.body.params.params.list) {
            var element = ''
            if (lengthList === Number(i) + 1) {
                element = `'${req.body.params.params.list[i]}'`;
            } else {
                element = `'${req.body.params.params.list[i]}',`
            }
            queryRoot += element;
        }
        queryRoot += ');'
        await db.query(`${queryRoot}`);
        if(req.body.params.params.data.length > 0){
            var queryInsert = `INSERT INTO prm."userCompany"(
                "BUKRS", "userId")
                VALUES`;
                lengthList = req.body.params.params.data.length;
                for (let i in req.body.params.params.data) {
                    var element = ''
                    if (lengthList === Number(i) + 1) {
                        element = `('${req.body.params.params.data[i].BUKRS}','${req.body.params.params.data[i].userId}')`;
                    } else {
                        element = `('${req.body.params.params.data[i].BUKRS}','${req.body.params.params.data[i].userId}'),`;
                    }
                    queryInsert += element;
                }
                queryInsert += ';'
                await db.query(`${queryInsert}`);
        }


        return res.status(200).json({ message: 'success' });
        
    } catch (error) {
        return res.status(500).json({ message: error });
    }

}
module.exports = {
    postUserCompany: postUserCompany,
}

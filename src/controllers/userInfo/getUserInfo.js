// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
const crypt = require("../../crypt/crypt");
require('dotenv').config()
const decodeJWT = require('jwt-decode');
const db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let getUserInfo = async (req, res) => {
  try {
    var userId = '';
    try {
      const token = req.headers.authorization.split(' ')[1];
      const basicAuth = Buffer.from(token, 'base64').toString('ascii');
      userId = basicAuth.split(':')[0].toUpperCase();
    } catch (error) {
      const accessToken = crypt.decrypt(req.headers.authorization);
      const decodeTk = decodeJWT(accessToken);
      userId = decodeTk.userId.toUpperCase();
    }
    db.query(`SELECT * FROM prm."userInfo" where "userId" = '${userId}';`, (err, resp) => {
        if (err) {
            return res.status(500).json({ database: err });
          } else {
            return res.status(200).json({ item: resp.rows,userId:userId });
          }
    }) 
  } catch (error) {
    return res.status(500).json({ database: error });
  }

}
module.exports = {
  getUserInfo: getUserInfo,
}

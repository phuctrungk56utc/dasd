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
let changePass = async (req, res) => {
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
    const getPass = await db.query(`select * from prm.users where "userId"='${userId}';`);
    const pass = crypt.decrypt(getPass.rows[0].password);
    if(req.body.params.PassOld === pass && req.body.params.PassNew === req.body.params.PassReNew){
        let passNew = crypt.encrypt(req.body.params.PassNew)
        db.query(`UPDATE prm.users
        SET "refreshToken"='', password='${passNew}', "changeBy"='${userId}',"changeAt"=now()
        WHERE "userId"='${userId}';`, (err, resp) => {
            if (err) {
                return res.status(200).json({ message: 'error' });
              } else {
                return res.status(200).json({ message: 'success' });
              }
        }) 
    }else{
        return res.status(200).json({ message: 'Password is incorrect' });
    }

  } catch (error) {
    return res.status(404).json({ message: 'error' });
  }

}
module.exports = {
    changePass: changePass,
}

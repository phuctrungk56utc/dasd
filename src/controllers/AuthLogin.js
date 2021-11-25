const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);
const crypt = require("../crypt/crypt");
require('dotenv').config()
const jwt = require("jsonwebtoken");
var sleep = require('sleep');
// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "30s";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
const accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH;
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "15d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.CIBER_PRM_JWT;
const db = require("../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let authLogin = async (req, res) => {
  try {
    // await sleep.sleep(1);
    const resp = await db.query(`SELECT * FROM prm.users users WHERE "users"."userId" = '${req.body.userId.toUpperCase()}'`)
      // const ciphertext = crypt.encrypt(String(req.body.password));
      try {
        // var roleData = null
        if(!resp.rows[0].activate || resp.rows[0].activate === 'false'){
          return res.status(404).json({ error: 'user not activate' });
        }
        if (req.body.userId.toUpperCase() === resp.rows[0].userId && crypt.encrypt(String(req.body.password)) === resp.rows[0].password) {
          const DbAccessTK = jwt.sign(
            {
              "userId": resp.rows[0].userId,
              key: process.env.CIBER_PRM_KEY_PRIVATE,
              //role: resp.rows//{ functionAll: true, functionView: null, functionCreateEditDelete: null, functionAdmin: null },
            },
            accessTokenSecretAccess,
            {
              expiresIn: accessTokenLife
            }
          )
          const DbRefreshTK = jwt.sign(
            {
              userId: resp.rows[0].userId.toUpperCase(),
              // key: process.env.CIBER_PRM_KEY_PRIVATE,
              // role: { functionAll: true, functionView: null, functionCreateEditDelete: null, functionAdmin: null },
            },
            accessTokenSecretRefresh,
            {
              expiresIn: refreshTokenLife
            }
          )
          const accessToken = crypt.encrypt(DbAccessTK);
          const refreshToken = crypt.encrypt(DbRefreshTK);
          await db.query(`UPDATE prm.users
          SET "refreshToken"='${refreshToken}' WHERE "userId" = '${req.body.userId.toUpperCase()}'`)
          return res.status(200).json({ accessToken: accessToken });
          //update to database
          // roleData = resp.rows;
        } else {
          return res.status(404).json({ error: 'Password is incorrect' });
        }
      } catch (error) {
        return res.status(404).json({ error: 'user not found' });
      }
    // console.log(resp)
    // await db.query(`UPDATE prm.users
    // SET "refreshToken"='${refreshToken}' WHERE "userId" = '${req.body.userId}'`)
  } catch (error) {
    return res.status(500).json(error);
  }
}

let auThRefresh = async (req, res) => {
  

  db.query(`SELECT * FROM prm.roles WHERE "userId" = '${decodeTk.userId}'
  ORDER BY "roleId" ASC`, (err, resp) => {
    if (err) {
      return res.status(500).json({ database: err });
    } else {
      return res.status(200).json({ roles: resp.rows });
    }
  })
  // return res.status(200).json({toKent:'Success'});
}
module.exports = {
  authLogin: authLogin,
  auThRefresh: auThRefresh
}

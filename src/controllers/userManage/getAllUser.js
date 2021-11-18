// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// const jwt = require("jsonwebtoken");
// var sleep = require('sleep');
// Thời gian sống của token
// const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "30s";
// // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
// const accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
// const accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH;
// // Thời gian sống của refreshToken
// const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "15d";
// // Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
// const refreshTokenSecret = process.env.CIBER_PRM_JWT;
const db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let getUser = async (req, res) => {
  try {
    // await sleep.sleep(1);
    db.query(`SELECT * FROM prm."userInfo"
    ORDER BY "userId" ASC `, (err, resp) => {
        if (err) {
            return res.status(500).json({ database: err });
          } else {
            return res.status(200).json({ item: resp.rows });
          }
    }) 
  } catch (error) {
    return res.status(500).json({ database: error });
  }

}
module.exports = {
    getUser: getUser,
}

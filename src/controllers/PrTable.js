const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);
const crypt = require("../crypt/crypt");
require('dotenv').config();
const decodeJWT = require('jwt-decode');
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
// const socIo = require("../../server");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let PrTable = async (req, res) => {
  // var start = new Date().getTime();
  // var notification = socIo;
  // notification.ioObject.socketIo.to(notification.ioObject.listUSer[0].id).emit("sendDataServer",{user});
  try {
      var userId = '';
      try {
          const token = req.headers.authorization.split(' ')[1];
          const basicAuth = Buffer.from(token, 'base64').toString('ascii');
          userId = basicAuth.split(':')[0];
      } catch (error) {
          const accessToken = crypt.decrypt(req.headers.authorization);
          const decodeTk = decodeJWT(accessToken);
          userId = decodeTk.userId.toUpperCase();
      }
    // await sleep.sleep(1);
    const data = req.query.dataFromNoti;
    var query;
    if(data !== '' && data !== undefined && data !== null){
      query = `SELECT * FROM prm."PrTable" WHERE "PR_NO"=${data};`
    }else{
      query = `SELECT * FROM prm."PrTable" WHERE "createBy"='${userId}'
      ORDER BY "changeAt" DESC; `
    }
    
    // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {
    db.query(query, (err, resp) => {
        if (err) {
            return res.status(500).json({ database: err });
          } else {
            // var end = new Date().getTime();
            // var time = end - start;
            // console.log(time)
            

            return res.status(200).json({ item: resp.rows });
          }
    }) 
  } catch (error) {
    return res.status(500).json({ database: error });
  }

}
module.exports = {
    PrTable: PrTable,
}

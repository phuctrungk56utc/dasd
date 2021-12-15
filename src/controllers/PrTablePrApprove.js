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
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let PrTablePrApprove = async (req, res) => {
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
    // await sleep.sleep(1);
    // db.query(`SELECT * FROM prm."PrTable" INNER JOIN prm."PrItem" ON prm."PrTable"."PrNumber" = prm."PrItem"."PrNumber"`, (err, resp) => {
    var query = '';

    var now = new Date(`${req.query.yearQuery}`,`${req.query.monthQuery}`,'01');
    var prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
    var prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);
    
    var formatDateComponent = function(dateComponent) {
      return (dateComponent < 10 ? '0' : '') + dateComponent;
    };
    
    var formatDate = function(date) {
      return formatDateComponent(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()));
    };

    if(req.query && req.query.type){
      if(req.query.type === 'All'){
        query = `SELECT * FROM prm."PrTable" pr INNER JOIN prm."PR_RELEASE_STRATEGY" rl ON pr."PR_NO" = rl."PR_NO" WHERE (pr."PR_SAP" <> 0
        and rl."userId" = '${userId.toUpperCase()}' or rl."userId" = '${userId.toLowerCase()}') and 
        ( pr."changeAt" BETWEEN '${formatDate(prevMonthFirstDate)} 00:00:00' AND '${formatDate(prevMonthLastDate)} 23:59:59' )
        and
        ( rl."changeAt" BETWEEN '${formatDate(prevMonthFirstDate)} 00:00:00' AND '${formatDate(prevMonthLastDate)} 23:59:59' )
            ORDER BY pr."changeAt" DESC
            ;`
      }else{
        query = `SELECT * FROM prm."PrTable" pr INNER JOIN prm."PR_RELEASE_STRATEGY" rl ON pr."PR_NO" = rl."PR_NO" WHERE (pr."PR_SAP" <> 0
        and rl."userId" = '${userId.toUpperCase()}' or rl."userId" = '${userId.toLowerCase()}') and 
        ( pr."changeAt" BETWEEN '${formatDate(prevMonthFirstDate)} 00:00:00' AND '${formatDate(prevMonthLastDate)} 23:59:59' )
        and
        ( rl."changeAt" BETWEEN '${formatDate(prevMonthFirstDate)} 00:00:00' AND '${formatDate(prevMonthLastDate)} 23:59:59' )
        and ( pr."STATUS"=${Number(req.query.statusCode)} )
            ORDER BY pr."changeAt" DESC
        ;`
      }

    } else {
      query = `SELECT * FROM prm."PrTable" pr INNER JOIN prm."PR_RELEASE_STRATEGY" rl ON pr."PR_NO" = rl."PR_NO" WHERE pr."PR_SAP" <> 0
    and rl."userId" = '${userId.toUpperCase()}' or rl."userId" = '${userId.toLowerCase()}'
        ORDER BY pr."changeAt" DESC
        ;`
    }
    db.query(query, (err, resp) => {
      if (err) {
        return res.status(500).json({ database: err });
      } else {
        // console.log('object')
        return res.status(200).json({ item: resp.rows });
      }
    })
  } catch (error) {
    return res.status(500).json({ database: error });
  }

}
module.exports = {
  PrTablePrApprove: PrTablePrApprove,
}

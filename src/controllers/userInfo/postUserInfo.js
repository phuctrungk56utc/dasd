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
let postUserInfo = async (req, res) => {
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
    const query = `INSERT INTO prm."userInfo" ("userId","userName","PositionCode", phone, "CCCD" ,sex , email, address,"Department", birthday )  
    select
    unnest(array['${userId}']::character varying[]) as "userId",
    unnest(array['${req.body.params.userName}']::text[]) as "userName",
    unnest(array['${req.body.params.PositionCode}']::character varying[]) as "PositionCode",
    unnest(array['${req.body.params.phone}']::integer[]) as phone,
    unnest(array['${req.body.params.CCCD}']::character varying[]) as "CCCD",
    unnest(array['${req.body.params.sex}']::character varying[]) as sex,
    unnest(array['${req.body.params.email}']::character varying[]) as email,
    unnest(array['${req.body.params.address}']::text[]) as address,
    unnest(array['${req.body.params.Department}']::text[]) as "Department",
    unnest(array['${req.body.params.birthday}']::text[]) as birthday
    ON CONFLICT ("userId") DO UPDATE 
      SET 
      "userId" = EXCLUDED."userId",
      "userName" = EXCLUDED."userName",
      "PositionCode" = EXCLUDED."PositionCode",
      phone = EXCLUDED.phone,
      "CCCD" = EXCLUDED."CCCD",
      sex = EXCLUDED.sex,
      email = EXCLUDED.email,
      address = EXCLUDED.address,
      "Department" = EXCLUDED."Department",
      birthday = EXCLUDED.birthday
      ;`
    //   UPDATE prm."userInfo"
    //   SET "userName"=${req.body.params.userName}, "PositionCode"=${req.body.params.PositionCode}, phone=${req.body.params.phone},
    //    "CCCD"=${req.body.params.CCCD}, sex=${req.body.params.sex}, email=${req.body.params.email},
    //     address=${req.body.params.address}, "Department"=${req.body.params.Department}, birthday=${req.body.params.birthday}
    //   WHERE "userId"='${req.body.params.userId};
    db.query(query, (err, resp) => {
        if (err) {
            return res.status(200).json({ message: 'err' });
          } else {
            return res.status(200).json({ message: 'success' });
          }
    }) 
  } catch (error) {
    return res.status(404).json({ database: error });
  }

}
module.exports = {
    postUserInfo: postUserInfo,
}

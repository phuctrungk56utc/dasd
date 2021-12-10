const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);
const crypt = require("../crypt/crypt");
require('dotenv').config();
const decodeJWT = require('jwt-decode');
const db = require("../db/db");
// const socIo = require("../../server");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let PostPrType = async (req, res) => {
  // var notification = socIo;
  // notification.ioObject.socketIo.to(notification.ioObject.listUSer[0].id).emit("sendDataServer",{user});
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

      var valueCode = [];
      var valueName = [];
      var valueTime = [];
      var valueUsers = [];
      for (let index in req.body.params.tablePrType) {
        valueCode.push(req.body.params.tablePrType[index].PR_TYPE);
        if(req.body.params.tablePrType[index].Description){
            valueName.push(req.body.params.tablePrType[index].Description);
        }else{
            valueName.push('');
        }
        valueTime.push('now()');
        valueUsers.push(userId);
      }
      db.query(`DELETE FROM prm."PrType";`)
      var query = `INSERT INTO prm."PrType" ("PR_TYPE", "Description","createAt","changeAt","createBy","changeBy") 
      select  
      unnest($1::character varying[]) as "PR_TYPE",
      unnest($2::text[]) as "Description",
      unnest($3::timestamp[]) as "createdAt",
      unnest($4::timestamp[]) as "changeAt",
      unnest($5::character varying[]) as "createBy",
      unnest($6::character varying[]) as "changeBy"
      ON CONFLICT ("PR_TYPE") DO UPDATE 
        SET "PR_TYPE" = EXCLUDED."PR_TYPE",
        "Description" = EXCLUDED."Description",
          "changeAt"=EXCLUDED."changeAt",
          "createBy"=EXCLUDED."createBy";`
      db.query(query,[valueCode,valueName,valueTime,valueTime,valueUsers,valueUsers], (err, resp) => {
        if (err) {
          return res.status(404).json({ message: err.message });
        } else {
          return res.status(200).json({ status:'Success' });
        }
      })
  } catch (error) {
    return res.status(500).json({ database: error });
  }

}
module.exports = {
    PostPrType: PostPrType,
}

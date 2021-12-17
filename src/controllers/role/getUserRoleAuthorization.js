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
let getUserRoleAuthorization = async (req, res) => {
  try {
    var userId = '';
    try {
      const token = req.headers.authorization.split(' ')[1];
      const basicAuth = Buffer.from(token, 'base64').toString('ascii');
      userId = basicAuth.split(':')[0].toUpperCase();
    } catch (error) {
      const accessToken = crypt.decrypt(req.headers.authorization);
      const decodeTk = decodeJWT(accessToken);
      userId = decodeTk.userId;
    }

    db.query(`SELECT r."RoleType",r."View",r."Create/Edit/Delete",r."All",r."Approve" FROM prm."roles" r INNER JOIN prm."userRole" u 
    ON r."RoleID" = u."RoleID" WHERE u."userId"='${userId}' `, (err, resp) => {
        if (err) {
            return res.status(500).json({ message: err });
          } else {
            return res.status(200).json({ item: resp.rows });
          }
    }) 
  } catch (error) {
	return res.status(500).json({ message: error });
  }

}
module.exports = {
    getUserRoleAuthorization: getUserRoleAuthorization,
}

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
let getUserCompany = async (req, res) => {
  try {
    // await sleep.sleep(1);
    db.query(`SELECT * FROM prm."userCompany"
    ORDER BY "userId" ASC `, (err, resp) => {
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
  getUserCompany: getUserCompany,
}

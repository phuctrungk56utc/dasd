require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
// unnest($1::character varying[]) as "RoleID",
// unnest($2::character varying[]) as "RoleType",
// unnest($3::text[]) as "Description",

// unnest($4::boolean[]) as "View",
// unnest($5::boolean[]) as "Create/Edit/Delete",
// unnest($6::boolean[]) as "Approve",
// unnest($7::boolean[]) as "All",

// unnest($8::timestamp[]) as "createdAt",
// unnest($9::timestamp[]) as "changeAt",
// unnest($10::character varying[]) as "createBy",
// unnest($11::character varying[]) as "changeBy"

// ON CONFLICT ("RoleID") DO UPDATE 
// SET
// "RoleType" = EXCLUDED."RoleType",
// "Description" = EXCLUDED."Description",
// "View" = EXCLUDED."View",
// "Create/Edit/Delete" = EXCLUDED."Create/Edit/Delete",
// "Approve" = EXCLUDED."Approve",
// "All" = EXCLUDED."All",
// "changeAt"=EXCLUDED."changeAt",
// "createBy"=EXCLUDED."createBy";
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let postRole = async (req, res) => {
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
    await db.query(`DELETE FROM prm.roles;`);
    var query = `INSERT INTO prm."roles" ("RoleID","RoleType","Description","View","Create/Edit/Delete","Approve","All","createAt","changeAt","createBy","changeBy") 
    VALUES `
    const leng = req.body.params.role.length;
    for(let index in req.body.params.role){
        var stringValueChiden = '';
        stringValueChiden = 
        `('${req.body.params.role[index].RoleID}',
        '${req.body.params.role[index].RoleType}',
        '${req.body.params.role[index].Description}',
        '${req.body.params.role[index].View === null ? false : req.body.params.role[index].View}',
        '${req.body.params.role[index]["Create/Edit/Delete"] === null ? false:req.body.params.role[index]["Create/Edit/Delete"]}',
        '${req.body.params.role[index].Approve === null ? false : req.body.params.role[index].Approve}',
        '${req.body.params.role[index].All === null ? false : req.body.params.role[index].All}',
        'now()','now()','${userId}','${userId}')`;
        if (leng > Number(index) + 1) {
            stringValueChiden += ','
        }

        query += stringValueChiden;
    }
    query += ';'
  db.query(query, (err, resp) => {
    if (err) {
      return res.status(404).json({ message: err.message });
    } else {
      return res.status(200).json({ message: 'Success' });
    }
  })
  } catch (error) {
	return res.status(500).json({ message: error.message });
  }

}
module.exports = {
    postRole: postRole,
}

require('dotenv').config()
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
const socIo = require("../../../server");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let createUsers = async (req, res) => {
	try {
		// await sleep.sleep(30);
		var notification = socIo;
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
		
		var listUsers = [];
		// var password = [];
		var activate = [];
		var refreshToken = []
		var userCreate = []
		var time = []

		var listUsersModifyPass = [];
		var passwordModifyPass = [];
		var activateModifyPass = [];
		var refreshTokenModifyPass = []
		var userCreateModifyPass = []
		var timeModifyPass = []
		for(let index in req.body.params.UsersClone){
			if(req.body.params.UsersClone[index].password !== ''){
				listUsersModifyPass.push(req.body.params.UsersClone[index].userId);
				activateModifyPass.push(req.body.params.UsersClone[index].activate);
				userCreateModifyPass.push(userId);
				refreshTokenModifyPass.push('')
	
				passwordModifyPass.push(crypt.encrypt(req.body.params.UsersClone[index].password))
				timeModifyPass.push('now()')
			}else{
				listUsers.push(req.body.params.UsersClone[index].userId);
				activate.push(req.body.params.UsersClone[index].activate);
				userCreate.push(userId);
				refreshToken.push('')
	
				// password.push(crypt.encrypt(req.body.params.UsersClone[index].password))
				time.push('now()')
			}

		}
		var	query = `INSERT INTO prm."users" ("userId", "activate","refreshToken","createAt","changeAt","createBy","changeBy")  
		select 
		unnest($1::character varying[]) as "userId", 
		unnest($2::boolean[]) as "activate",
		unnest($3::text[]) as "refreshToken",

		unnest($4::timestamp[]) as "createdAt",
		unnest($5::timestamp[]) as "changeAt",
		unnest($6::character varying[]) as "createBy",
		unnest($7::character varying[]) as "changeBy"

		ON CONFLICT ("userId") DO UPDATE 
		  SET
		  "activate"=EXCLUDED."activate",
		  "refreshToken"=EXCLUDED."refreshToken",
			"changeAt"=EXCLUDED."changeAt",
			"changeBy"=EXCLUDED."changeBy";`
		var	queryNoUpdatePass = `INSERT INTO prm."users" ("userId", "password","activate","refreshToken","createAt","changeAt","createBy","changeBy")  
			select 
			unnest($1::character varying[]) as "userId", 
			unnest($2::character varying[]) as "password",
			unnest($3::boolean[]) as "activate",
			unnest($4::text[]) as "refreshToken",
	
			unnest($5::timestamp[]) as "createdAt",
			unnest($6::timestamp[]) as "changeAt",
			unnest($7::character varying[]) as "createBy",
			unnest($8::character varying[]) as "changeBy"
	
			ON CONFLICT ("userId") DO UPDATE 
			  SET "password" = EXCLUDED."password",
			  "activate"=EXCLUDED."activate",
			  "refreshToken"=EXCLUDED."refreshToken",
				"changeAt"=EXCLUDED."changeAt",
				"changeBy"=EXCLUDED."changeBy";`
		
		var rs = await db.query(query,[listUsers,activate,refreshToken,time,time,userCreate,userCreate])
		await db.query(queryNoUpdatePass,[listUsersModifyPass,passwordModifyPass,activateModifyPass,refreshTokenModifyPass,timeModifyPass,timeModifyPass,userCreateModifyPass,userCreateModifyPass]);

		for (let i in notification.ioObject.listUSer) {
			for(let index in req.body.params.UsersClone){
				if (notification.ioObject.listUSer[i].userId.toUpperCase() === req.body.params.UsersClone[index].userId.toUpperCase()) {
					notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("logoutFromServer");
				}
			}
		}
		return res.status(200).json({ message: 'success' });
	} catch (error) {
        return res.status(404).json({ message: error.message });
	}

}
module.exports = {
	createUsers: createUsers,
}

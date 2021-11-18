/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/auth.js
 */
const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);
const db = require("../db/db");
const crypt = require("../crypt/crypt");
const jwt = require("jsonwebtoken");
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-trungquandev.com-green-cat-a@";
const accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res
 * @param {*} next 
 */
let isPrData = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] ? req.headers.authorization.split(' ')[1] : req.headers.authorization;
        if (req.headers.authorization.split(' ')[1]) {
            const basicAuth = Buffer.from(token, 'base64').toString('ascii')
            // console.log(Buffer.from(token, 'base64').toString('ascii'));
            // console.log(basicAuth.split(':')[0])
            // console.log(basicAuth.split(':')[1])
            try {
                db.query(`SELECT * FROM prm.users users WHERE "users"."userId" = '${basicAuth.split(':')[0].toUpperCase()}'`, (err, resp) => {
                    if (err) {
                        return res.status(500).json({ err });
                    } else {
                        if (resp.rows.length > 0 && crypt.encrypt(String(basicAuth.split(':')[1])) === resp.rows[0].password) {
                            // return res.status(200).json({ data: resp.rows[0].userId });
                            next();
                        }
                        else {
                            return res.status(404).json({ error:'Authentication error' });
                        }
                    }
                })
            } catch (error) {
                return res.status(404).json({ error });
            }
        } else {
            try {
                const accessToken = crypt.decrypt(token);
                jwt.verify(accessToken, accessTokenSecretAccess, (error, decoded) => {
                    if (error) {
                        next();
                        // return res.status(404).json({ error,message:'session expires' });
                    } else {
                        next();
                    }
                })
            } catch (error) {
                next();
                // return res.status(500).json({ error });
            }
        }
    } catch (error) {
        // next();
        return res.status(403).json({ error:'Authentication error' });
    }
}

module.exports = {
    isPrData: isPrData,
};

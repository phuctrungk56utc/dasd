/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/auth.js
 */
const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);
const db = require("../db/db");
const crypt = require("../crypt/crypt");
const jwt = require("jsonwebtoken");
const decodeJWT = require('jwt-decode');
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
        var userId = '';
        if (req.headers.authorization.split(' ')[1]) {
            const basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0].toUpperCase();
        } else {
            const accessToken = crypt.decrypt(req.headers.authorization);
            const decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
        }
        const token = req.headers.authorization.split(' ')[1] ? req.headers.authorization.split(' ')[1] : req.headers.authorization;
        var checkRole = null
        var roleApi = null
        var checkAuthoRole = false;
        var checkRun = false
        if (req.originalUrl.split('?')[0] !== '/getNotification') {
            checkRun = true;

            checkRole = await db.query(`select t2."RoleType",t2."View",t2."Create/Edit/Delete",t2."Approve",t2."All" from prm."userRole" t1 inner join
        prm."roles" t2 on t1."RoleID" = t2."RoleID" where t1."userId"='${userId}'`);
            roleApi = await db.query(`SELECT * FROM prm."roleApi" where "api"='${req.originalUrl.split('?')[0]}'`);
            try {
                for (let index in checkRole.rows) {
                    if (checkRole.rows[index].RoleType === 'All' ||
                        (checkRole.rows[index].All === true && checkRole.rows[index].RoleType === roleApi.rows[0].RoleType) ||
                        (eval(`checkRole.rows[index]['${roleApi.rows[0].action}']`) === true && checkRole.rows[index].RoleType === roleApi.rows[0].RoleType)) {
                        checkAuthoRole = true;
                        break
                    }
                }
            } catch (error) {
                return res.status(403).json({ message: 'You are not authorized to perform this action' });
            }

        }
        if (checkAuthoRole && checkRun || (!checkRun)) {

            if (req.headers.authorization.split(' ')[1]) {
                const basicAuth = Buffer.from(token, 'base64').toString('ascii')
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
                                return res.status(403).json({ message: 'Authentication error' });
                            }
                        }
                    })
                } catch (error) {
                    return res.status(403).json({ message: 'Authentication error' });
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
        } else {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }
    } catch (error) {
        // next();
        return res.status(403).json({ message: 'Authentication error' });
    }
}

module.exports = {
    isPrData: isPrData,
};
